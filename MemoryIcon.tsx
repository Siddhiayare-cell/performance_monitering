import React from 'react';

// Fix: Update component to accept all standard SVG props (like style and className)
// and pass them to the underlying SVG element. This resolves the type error in MetricCard.
const MemoryIcon: React.FC<React.ComponentProps<'svg'>> = (props) => (
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
    <path d="M2 13h2"></path>
    <path d="M20 13h2"></path>
    <path d="M5 13H2"></path>
    <path d="M17 13h5"></path>
    <path d="M6 13H5"></path>
    <path d="M18 13h-1"></path>
    <path d="M8 13v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3"></path>
    <path d="M8 13h8"></path>
    <rect x="3" y="5" width="18" height="14" rx="2"></rect>
  </svg>
);

export default MemoryIcon;
