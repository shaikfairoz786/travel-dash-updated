import React from 'react';

const ForSaleBanner: React.FC = () => {
    return (
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-4 py-3 text-center sticky top-0 z-[100] shadow-md w-full">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm sm:text-base font-bold">
                <span className="flex items-center gap-2">
                    <span className="animate-pulse">🚀</span>
                    This Premium Full-Stack Travel Application Source Code is For Sale!
                </span>
                <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=shaik.fairoz9786@gmail.com&su=Inquiry%20regarding%20TravelTemplate%20Source%20Code"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-purple-700 px-4 py-1.5 rounded-full font-extrabold hover:bg-gray-100 transition-all hover:scale-105 shadow-sm whitespace-nowrap"
                >
                    Contact to Purchase →
                </a>
            </div>
        </div>
    );
};

export default ForSaleBanner;
