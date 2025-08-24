'use client'

import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { Users, Wifi, WifiOff } from "lucide-react";

const ParticipantCount = () => {
    const call = useCall();
    const { useParticipants } = useCallStateHooks();
    const participants = useParticipants();

    if (!call) return null;

    const participantCount = participants.length;
    const isConnected = call.state.connectionState === 'connected';

    return (
        <div className="fixed top-4 right-4 bg-black/20 backdrop-blur-md rounded-2xl px-3 py-2 border border-white/10 shadow-lg z-50">
            <div className="flex items-center gap-2 text-white text-sm">
                <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span className="font-semibold">{participantCount}</span>
                </div>
                <div className="flex items-center gap-1">
                    {isConnected ? (
                        <Wifi size={16} className="text-green-400" />
                    ) : (
                        <WifiOff size={16} className="text-red-400" />
                    )}
                    <span className="text-xs opacity-75">
                        {isConnected ? 'Connected' : 'Connecting...'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ParticipantCount;
