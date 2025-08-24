'use client'

import { useCall } from "@stream-io/video-react-sdk";
import { useState } from "react";
import { Button } from "./ui/button";
import { Monitor } from "lucide-react";
import { toast } from "sonner";

const ScreenShareButton = () => {
    const call = useCall();
    const [isLoading, setIsLoading] = useState(false);

    if (!call) {
        throw new Error('useStreamCall must be used within a StreamCall component.');
    }

    const handleScreenShare = async () => {
        setIsLoading(true);
        
        try {
            // Placeholder for screen sharing functionality
            toast('Screen sharing feature coming soon!', {
                duration: 2000,
                className: '!bg-gray-300 !rounded-3xl !py-8 !px-5 !justify-center',
            });
        } catch (error) {
            console.error('Screen sharing error:', error);
            toast('An error occurred with screen sharing', {
                duration: 3000,
                className: '!bg-red-300 !rounded-3xl !py-8 !px-5 !justify-center',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleScreenShare}
            disabled={isLoading}
            className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b] disabled:opacity-50"
            title="Screen sharing (coming soon)"
        >
            {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
                <Monitor size={20} className="text-white" />
            )}
        </Button>
    );
};

export default ScreenShareButton;
