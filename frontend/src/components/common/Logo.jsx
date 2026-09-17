import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function Logo({ size = 'default', showWordmark = true, to }) {
  const { user } = useAuthStore();

  // Dynamic destination: If logged in go to /dashboard, if not logged in go to /
  // If a custom route is passed that isn't '/' or '/dashboard', respect it
  const destination = to && to !== '/' && to !== '/dashboard' ? to : (user ? '/dashboard' : '/');

  const sizeMap = {
    sm: { box: 'w-7 h-7', text: 'text-base', svg: 'w-5 h-5' },
    default: { box: 'w-9 h-9', text: 'text-lg', svg: 'w-7 h-7' },
    lg: { box: 'w-12 h-12', text: 'text-2xl', svg: 'w-9 h-9' }
  };
  const config = sizeMap[size] || sizeMap.default;

  const content = (
    <div className="flex items-center gap-2.5 group cursor-pointer">
      <div className={`${config.box} rounded-xl bg-gradient-to-br from-[#00F2FE]/15 via-[#007AFF]/20 to-transparent border border-[#00F2FE]/40 flex items-center justify-center shadow-[0_0_16px_rgba(0,242,254,0.3)] group-hover:shadow-[0_0_24px_rgba(0,242,254,0.55)] group-hover:border-[#00F2FE]/80 transition-all duration-300`}>
        <img src="/assets/logo.svg" alt="RefineIQ" className={`${config.svg} drop-shadow-[0_0_10px_rgba(0,242,254,0.75)]`} />
      </div>
      {showWordmark && (
        <span className={`font-headline ${config.text} font-extrabold tracking-tight text-white flex items-center`}>
          Refine<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F2FE] via-[#007AFF] to-[#38BDF8] ml-0.5">IQ</span>
        </span>
      )}
    </div>
  );

  return (
    <Link to={destination} className="inline-block outline-none focus:ring-2 focus:ring-[#007AFF]/40 rounded-lg">
      {content}
    </Link>
  );
}

