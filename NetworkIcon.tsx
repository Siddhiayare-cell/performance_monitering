import React from 'react';

// Fix: Update component to accept all standard SVG props (like style and className)
// and pass them to the underlying SVG element. This resolves the type error in MetricCard.
const NetworkIcon: React.FC<React.ComponentProps<'svg'>> = (props) => (
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
    <path d="M12 12v-2" />
    <path d="M10 10H8" />
    <path d="M12 12v2" />
    <path d="M10 14H8" />
    <path d="M12 12h2" />
    <path d="M14 10h2" />
    <path d="M12 12h2" />
    <path d="M14 14h2" />
    <path d="M18 12h2" />
    <path d="M6 12H4" />
    <path d="M12 6V4" />
    <path d="M12 20v-2" />
    <circle cx="12" cy="12" r="8" />
  </svg>
);

export default NetworkIcon;
