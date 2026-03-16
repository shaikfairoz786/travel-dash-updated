import React from 'react';

const ForSaleBanner: React.FC = () => {
    return (
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-2 py-2 text-center sticky top-0 z-[100] shadow-md w-full h-[48px] sm:h-[48px] flex items-center justify-center overflow-hidden">
            <div className="container mx-auto flex flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-base font-bold">
                <span className="flex items-center gap-2 truncate">
                    <span className="animate-pulse flex-shrink-0">🚀</span>
                    <span className="hidden sm:inline">This Premium Full-Stack Travel Application Source Code is For Sale!</span>
                    <span className="sm:hidden truncate">Premium App Source Code For Sale!</span>
                </span>
                <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=shaik.fairoz9786@gmail.com&su=Inquiry%20regarding%20TravelTemplate%20Source%20Code"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-purple-700 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full font-extrabold hover:bg-gray-100 transition-all hover:scale-105 shadow-sm whitespace-nowrap flex-shrink-0 text-xs sm:text-sm"
                >
                    Contact <span className="hidden sm:inline">to Purchase</span> →
                </a>
            </div>
        </div>
    );
};

export default ForSaleBanner;
