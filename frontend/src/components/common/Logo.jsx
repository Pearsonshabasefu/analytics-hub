import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'default', showWordmark = true, to = '/' }) {
  const sizeMap = {
    sm: { box: 'w-7 h-7', text: 'text-base', svg: 'w-5 h-5' },
    default: { box: 'w-9 h-9', text: 'text-lg', svg: 'w-6 h-6' },
    lg: { box: 'w-11 h-11', text: 'text-2xl', svg: 'w-8 h-8' }
  };
  const config = sizeMap[size] || sizeMap.default;

  const content = (
    <div className="flex items-center gap-2.5 group">
      <div className={`${config.box} rounded-xl bg-gradient-to-br from-[#007AFF]/20 via-[#00F2FE]/10 to-transparent border border-[#007AFF]/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,122,255,0.25)] group-hover:shadow-[0_0_22px_rgba(0,122,255,0.45)] group-hover:border-[#00F2FE]/60 transition-all duration-300`}>
        <img src="/assets/logo.svg" alt="RefineIQ" className={`${config.svg} drop-shadow-[0_0_8px_rgba(0,242,254,0.6)]`} />
      </div>
      {showWordmark && (
        <span className={`font-headline ${config.text} font-extrabold tracking-tight text-white flex items-center`}>
          Refine<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#007AFF] via-[#00F2FE] to-[#34D399] ml-0.5">IQ</span>
        </span>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-block outline-none focus:ring-2 focus:ring-[#007AFF]/40 rounded-lg">
        {content}
      </Link>
    );
  }
  return content;
}
