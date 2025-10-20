'use client'

import { useUser, useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    const { isLoaded, isSignedIn } = useUser();
    const { isLoaded: authLoaded } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && authLoaded) {
            if (isSignedIn) {
                // User is signed in, ensure we're on the correct page
                const currentPath = window.location.pathname;
                if (currentPath === '/' || currentPath === '/login' || currentPath === '/register') {
                    router.push('/');
                }
            } else {
                // User is not signed in, redirect to login if not already there
                const currentPath = window.location.pathname;
                if (currentPath !== '/login' && currentPath !== '/register') {
                    router.push('/');
                }
            }
        }
    }, [isLoaded, authLoaded, isSignedIn, router]);

    // Show loading state while authentication is being determined
    if (!isLoaded || !authLoaded) {
        return <LoadingSpinner />;
    }

    // Force re-render when authentication state changes
    return <div key={isSignedIn ? 'signed-in' : 'signed-out'}>{children}</div>;
};

export default AuthWrapper;
