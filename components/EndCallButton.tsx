'use client'

import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const EndCallButton = () => {
    const router = useRouter();
    const call = useCall();
    if (!call)
        throw new Error(
          'useStreamCall must be used within a StreamCall component.',
    );

    const { useLocalParticipant } = useCallStateHooks();

    const localParticipant = useLocalParticipant();

    const isMeetingOwner =
    localParticipant &&
    call.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

    if (!isMeetingOwner) return null;

    const endCall = async () => {
        await call.endCall();
        router.push('/');
    };

    return (
        <Button 
            onClick={endCall} 
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-3 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 border border-red-500/20 hover:scale-105 text-sm sm:text-base"
        >
          <span className="hidden sm:inline">🚪 End Call</span>
          <span className="sm:hidden">🚪 End</span>
        </Button>
      );




}

export default EndCallButton