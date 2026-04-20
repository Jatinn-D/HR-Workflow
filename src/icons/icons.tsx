import React from 'react';

const SvgBase = ({ children, className, strokeColor = "currentColor" }: { children: React.ReactNode, className?: string, strokeColor?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={strokeColor}
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {children}
  </svg>
);

export const PlayIcon = ({ className, color = "#16a34a" }: { className?: string, color?: string }) => (
  <SvgBase className={className} strokeColor={color}>
    <path d="M5 3 L19 12 L5 21 Z" />
  </SvgBase>
);

export const CheckSquareIcon = ({ className, color = "#2563eb" }: { className?: string, color?: string }) => (
  <SvgBase className={className} strokeColor={color}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <path d="M9 12 l2 2 l4 -4" />
  </SvgBase>
);

export const UserCheckIcon = ({ className, color = "#d97706" }: { className?: string, color?: string }) => (
  <SvgBase className={className} strokeColor={color}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <path d="M17 11l2 2l4-4" />
  </SvgBase>
);

export const CpuIcon = ({ className, color = "#9333ea" }: { className?: string, color?: string }) => (
  <SvgBase className={className} strokeColor={color}>
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
    <path d="M9 9h6v6H9z" />
    <path d="M9 1v3" />
    <path d="M15 1v3" />
    <path d="M9 20v3" />
    <path d="M15 20v3" />
    <path d="M20 9h3" />
    <path d="M20 14h3" />
    <path d="M1 9h3" />
    <path d="M1 14h3" />
  </SvgBase>
);

export const StopCircleIcon = ({ className, color = "#dc2626" }: { className?: string, color?: string }) => (
  <SvgBase className={className} strokeColor={color}>
    <circle cx="12" cy="12" r="10" />
    <rect x="9" y="9" width="6" height="6" />
  </SvgBase>
);
