import React from 'react';

import { Plane, Globe } from 'lucide-react';

const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-md transition-all duration-500">

      {/* Outer Pulse Ring */}
      <div className="relative flex justify-center items-center h-48 w-48 animate-pulse-ring rounded-full border border-emerald-100 bg-emerald-50">

        {/* Globe Background */}
        <div className="absolute text-emerald-200 opacity-50 animate-spin-slow">
          <Globe size={100} strokeWidth={1} />
        </div>

        {/* Orbiting Plane */}
        <div className="absolute flex items-center justify-center w-full h-full animate-orbit">
          <div className="text-emerald-600 bg-white rounded-full p-2 shadow-lg z-10">
            <Plane size={24} strokeWidth={2.5} className="rotate-45" />
          </div>
        </div>

        {/* Center Logo */}
        <div className="absolute z-20 flex flex-col items-center justify-center bg-white rounded-full h-20 w-20 shadow-xl border-2 border-emerald-50">
          <span className="text-emerald-800 font-extrabold text-3xl font-poppins tracking-tighter">
            T
          </span>
        </div>
      </div>

      {/* Loading Text */}
      <div className="mt-12 flex flex-col items-center animate-float-subtle">
        <h3 className="text-xl font-poppins font-semibold text-emerald-800 tracking-wide">
          Preparing your journey
        </h3>
        <div className="flex space-x-1 mt-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>

    </div>
  );
};

export default PageLoader;
