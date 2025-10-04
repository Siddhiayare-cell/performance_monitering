import React from 'react';

// Fix: Update component to accept all standard SVG props (like style and className)
// and pass them to the underlying SVG element. This resolves the type error in MetricCard.
const DiskIcon: React.FC<React.ComponentProps<'svg'>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <ellipse cx="12" cy="12" rx="10" ry="4" />
    <path d="M12 16C6.477 16 2 14.209 2 12" />
    <path d="M22 12c0 2.209-4.477 4-10 4" />
    <path d="M2 12c0-2.209 4.477-4 10-4" />
    <path d="M12 8c5.523 0 10 1.791 10 4" />
    <line x1="12" y1="12" x2="12" y2="12" />
    <path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
  </svg>
);

export default DiskIcon;
