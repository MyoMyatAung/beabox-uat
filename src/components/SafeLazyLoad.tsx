import React, { Suspense, useState, useEffect, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import Loader from "@/components/shared/loader";

interface SafeLazyLoadProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * A component that wraps Suspense and adds error handling for lazy loaded components
 * Redirects to home page if module import fails
 */
const SafeLazyLoad: React.FC<SafeLazyLoadProps> = ({ 
  children, 
  fallback = <Loader />
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Add a global handler to catch chunk loading errors
    const handleChunkError = (event: ErrorEvent) => {
      // Check if this is a chunk loading error
      if (
        event.message.includes("Loading chunk") || 
        event.message.includes("Loading CSS chunk") ||
        event.message.includes("importing a module")
      ) {
        setHasError(true);
      }
    };

    window.addEventListener('error', handleChunkError);
    
    return () => {
      window.removeEventListener('error', handleChunkError);
    };
  }, []);

  if (hasError) {
    // When error occurs, redirect to the home page
    return <Navigate to="/" replace />;
  }

  return <Suspense fallback={fallback}>{children}</Suspense>;
};

export default SafeLazyLoad; 