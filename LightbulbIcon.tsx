import React from 'react';

const LightbulbIcon: React.FC<React.ComponentProps<'svg'>> = (props) => (
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
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 14.5a4.5 4.5 0 0 0 4.5-4.5c0-2.06-1.03-3.88-2.5-4.95A5 5 0 0 0 8 9.5c0 2.48 2.02 4.5 4.5 4.5Z" />
    <path d="M12 2v3" />
    <path d="M6.34 7.34l2.12 2.12" />
    <path d="M15.54 9.46l2.12-2.12" />
  </svg>
);

export default LightbulbIcon;
