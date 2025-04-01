import { useEffect } from 'react';

const PreventSwipeBack = () => {
    useEffect(() => {
        // Push a new history state so that popstate doesn't navigate back
        history.pushState(null, '', location.href);

        const handlePopState = () => {
            // Push the same state again to prevent navigation
            // history.pushState(null, '', location.href);
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    return null; // No UI needed
};

export default PreventSwipeBack;