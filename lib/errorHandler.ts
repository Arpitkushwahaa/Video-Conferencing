// Global error handler to suppress Stream SDK console errors
export const setupErrorHandler = () => {
    // Store original console methods
    const originalError = console.error;
    const originalWarn = console.warn;

    // Override console.error to filter out Stream SDK screen sharing errors
    console.error = (...args: any[]) => {
        const message = args.join(' ');
        
        // Filter out specific Stream SDK screen sharing permission errors
        if (
            message.includes('[devices]: Failed to get screen share stream') ||
            message.includes('NotAllowedError: Permission denied by user') ||
            message.includes('getDisplayMedia') ||
            message.includes('screen share')
        ) {
            // Suppress these errors - they're handled gracefully in our components
            return;
        }
        
        // Log all other errors normally
        originalError.apply(console, args);
    };

    // Override console.warn to filter out Stream SDK warnings
    console.warn = (...args: any[]) => {
        const message = args.join(' ');
        
        // Filter out specific Stream SDK warnings
        if (
            message.includes('[devices]: Failed to get screen share stream') ||
            message.includes('NotAllowedError: Permission denied by user') ||
            message.includes('getDisplayMedia') ||
            message.includes('screen share')
        ) {
            // Suppress these warnings - they're handled gracefully in our components
            return;
        }
        
        // Log all other warnings normally
        originalWarn.apply(console, args);
    };

    // Return cleanup function
    return () => {
        console.error = originalError;
        console.warn = originalWarn;
    };
};
