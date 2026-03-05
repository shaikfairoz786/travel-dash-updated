import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PageLoader from './PageLoader';

const RouteTransitionLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setIsLoading(true);

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500); // 500ms delay to give a visual indication of loading during route transitions

        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <>
            {isLoading && <PageLoader />}
            {children}
        </>
    );
};

export default RouteTransitionLoader;
