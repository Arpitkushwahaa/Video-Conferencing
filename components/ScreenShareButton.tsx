'use client'

import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Monitor, MonitorOff } from "lucide-react";
import { toast } from "sonner";

const ScreenShareButton = () => {
    const call = useCall();
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (!call) {
        throw new Error('useStreamCall must be used within a StreamCall component.');
    }

    const { useLocalParticipant } = useCallStateHooks();
    const localParticipant = useLocalParticipant();

    // Listen for screen sharing state changes
    useEffect(() => {
        const checkScreenShareState = () => {
            if (localParticipant) {
                const isCurrentlySharing = localParticipant.publishedTracks.some(
                    track => track.type === 'screenShareAudio' || track.type === 'screenShareVideo'
                );
                setIsScreenSharing(isCurrentlySharing);
            }
        };

        // Check initial state
        checkScreenShareState();

        // Set up interval to check for state changes
        const interval = setInterval(checkScreenShareState, 1000);

        return () => clearInterval(interval);
    }, [localParticipant]);

    const toggleScreenShare = async () => {
        if (!localParticipant) return;

        setIsLoading(true);
        
        try {
            if (isScreenSharing) {
                // Stop screen sharing
                await call.stopScreenShare();
                setIsScreenSharing(false);
                toast('Screen sharing stopped', {
                    duration: 2000,
                    className: '!bg-gray-300 !rounded-3xl !py-8 !px-5 !justify-center',
                });
            } else {
                // Start screen sharing with error handling
                try {
                    await call.startScreenShare();
                    setIsScreenSharing(true);
                    toast('Screen sharing started', {
                        duration: 2000,
                        className: '!bg-gray-300 !rounded-3xl !py-8 !px-5 !justify-center',
                    });
                } catch (error: any) {
                    if (error.name === 'NotAllowedError') {
                        toast('Screen sharing permission denied. Please allow screen sharing in your browser.', {
                            duration: 4000,
                            className: '!bg-red-300 !rounded-3xl !py-8 !px-5 !justify-center',
                        });
                    } else if (error.name === 'NotSupportedError') {
                        toast('Screen sharing is not supported in this browser.', {
                            duration: 4000,
                            className: '!bg-red-300 !rounded-3xl !py-8 !px-5 !justify-center',
                        });
                    } else if (error.name === 'NotFoundError') {
                        toast('No screen or window found to share.', {
                            duration: 4000,
                            className: '!bg-red-300 !rounded-3xl !py-8 !px-5 !justify-center',
                        });
                    } else {
                        toast('Failed to start screen sharing. Please try again.', {
                            duration: 4000,
                            className: '!bg-red-300 !rounded-3xl !py-8 !px-5 !justify-center',
                        });
                    }
                    console.warn('Screen sharing error:', error);
                }
            }
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
            onClick={toggleScreenShare}
            disabled={isLoading}
            className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b] disabled:opacity-50"
            title={isScreenSharing ? "Stop screen sharing" : "Start screen sharing"}
        >
            {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : isScreenSharing ? (
                <MonitorOff size={20} className="text-white" />
            ) : (
                <Monitor size={20} className="text-white" />
            )}
        </Button>
    );
};

export default ScreenShareButton;
