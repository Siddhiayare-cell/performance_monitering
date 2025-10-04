import { GoogleGenAI, Type } from '@google/genai';
import { type Metric, type Thresholds } from '../types';

// IMPORTANT: This key is automatically populated by the environment.
// Do not replace it with a hardcoded key.
const apiKey = process.env.API_KEY;
if (!apiKey) {
    // In a real app, you might have a more robust way to handle this,
    // but for this project, we'll throw an error if the key is missing.
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

const reportSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "A concise, engaging title for the performance report.",
        },
        executiveSummary: {
            type: Type.STRING,
            description: "A high-level summary (2-3 sentences) of the system's performance, mentioning key observations.",
        },
        alerts: {
            type: Type.ARRAY,
            description: "A list of any metrics that have crossed their alert thresholds. If no alerts, this should be an empty array.",
            items: {
                type: Type.OBJECT,
                properties: {
                    metricName: { type: Type.STRING, description: "Name of the metric that triggered the alert (e.g., 'CPU Usage')." },
                    peakValue: { type: Type.NUMBER, description: "The peak value observed for this metric." },
                    threshold: { type: Type.NUMBER, description: "The configured threshold for this metric." },
                    timestamp: { type: Type.STRING, description: "The ISO 8601 timestamp of when the peak value occurred." },
                },
                required: ["metricName", "peakValue", "threshold"],
            },
        },
        recommendations: {
            type: Type.ARRAY,
            description: "A list of actionable recommendations to improve system performance or address issues. Each recommendation should be a string.",
            items: {
                type: Type.STRING,
            },
        },
    },
    required: ["title", "executiveSummary", "alerts", "recommendations"],
};

export const generatePerformanceReport = async (metrics: Metric[], thresholds: Thresholds): Promise<string> => {
    
    const relevantData = metrics.map(m => {
        const dataPoints = m.data.slice(-10); // Use last 10 data points for brevity
        const values = dataPoints.map(p => p.value.toFixed(2));
        const avg = dataPoints.length > 0 ? dataPoints.reduce((sum, p) => sum + p.value, 0) / dataPoints.length : 0;
        return {
            name: m.name,
            unit: m.unit,
            threshold: thresholds[m.id],
            average: avg.toFixed(2),
            recentValues: values,
        };
    });

    const prompt = `
        Analyze the following system performance data. Generate a concise report in JSON format.
        The data includes metric names, their units, configured alert thresholds, average values, and the last 10 recorded values.
        The current time is ${new Date().toISOString()}.

        Data:
        ${JSON.stringify(relevantData, null, 2)}

        Based on this data, provide:
        1. A short title for the report.
        2. An "executive summary" (2-3 sentences) of the overall system health.
        3. A list of specific "alerts" where a metric's recent values exceeded its threshold. Include metric name, peak value, and threshold.
        4. A list of actionable "recommendations" to investigate or improve performance. If performance is stable, suggest potential areas for future optimization.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: reportSchema,
            },
        });

        return response.text;
    } catch (error) {
        console.error("Error generating performance report:", error);
        return JSON.stringify({
            title: "Error Generating Report",
            executiveSummary: "Could not generate the performance report due to an API error. Please check the console for details.",
            alerts: [],
            recommendations: ["Check that your API_KEY is valid and has been configured correctly in the environment.", "Review the error logs in the browser's developer console."],
        });
    }
};
