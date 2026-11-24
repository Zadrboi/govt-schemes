import React from 'react';

interface DrishtiEmblemProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
}

export const DrishtiEmblem: React.FC<DrishtiEmblemProps> = ({
  className = '',
  size = 28,
  showWordmark = true,
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Geometric eye-chevron with botanical rising arc & apex dot in deep cobalt and cerulean */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary dark:text-sky-400 transition-transform hover:scale-105"
        aria-hidden="true"
      >
        {/* Core focal iris dot */}
        <circle cx="16" cy="16" r="3.2" fill="#1d4ed8" className="dark:fill-[#60a5fa]" />
        
        {/* Rising upper editorial arc */}
        <path
          d="M 4 16 C 9 8, 23 8, 28 16"
          stroke="#1d4ed8"
          strokeWidth="2.2"
          strokeLinecap="round"
          className="dark:stroke-[#60a5fa]"
        />
        
        {/* Lower cerulean grounding arc */}
        <path
          d="M 4 16 C 9 23, 23 23, 28 16"
          stroke="#0284c7"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="0.5 3"
          className="dark:stroke-[#38bdf8]"
        />
        
        {/* Zenith aperture indicator */}
        <circle cx="16" cy="7" r="1.5" fill="#7dd3fc" className="dark:fill-[#bae6fd]" />
      </svg>

      {showWordmark && (
        <span className="font-display font-medium text-lg tracking-[-0.04em] text-ink dark:text-slate-100 flex items-baseline">
          drishti
          <span className="text-[11px] font-normal tracking-normal text-primary dark:text-sky-400 ml-1 opacity-90">
            (দৃষ্টি)
          </span>
        </span>
      )}
    </div>
  );
};

export default DrishtiEmblem;
