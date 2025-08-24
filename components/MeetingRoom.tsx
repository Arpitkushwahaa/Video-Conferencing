'use client'

import { useUser } from "@clerk/nextjs";
import { CallControls, CallingState, CallParticipantsList, CallStatsButton, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useState, useEffect } from "react";
import Loading from "./Loading";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { LayoutList, Users } from "lucide-react";
import EndCallButton from "./EndCallButton";
import { useResponsive } from "@/hooks/useResponsive";
import ParticipantCount from "./ParticipantCount";

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

const MeetingRoom = () => {
    const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
    const [showParticipants, setShowParticipants] = useState(false);
    const router = useRouter();
    const pathname = usePathname()  
    const { user } = useUser();
    const { isMobile, isTablet, isDesktop } = useResponsive();
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();

    // Auto-adjust layout based on screen size
    useEffect(() => {
        if (isMobile) {
            setLayout('grid'); // Grid layout works better on mobile
        } else if (isTablet) {
            setLayout('speaker-left'); // Speaker layout for tablets
        } else {
            setLayout('speaker-left'); // Default for desktop
        }
    }, [isMobile, isTablet, isDesktop]);

    // Early returns after all hooks
    if(!user) return null;
    if (callingState !== CallingState.JOINED) return <Loading />;

    const CallLayout = () => {
        switch (layout) {
          case 'grid':
            return (
              <div className="w-full h-full">
                <PaginatedGridLayout 
                  groupSize={isMobile ? 4 : isTablet ? 6 : 9}
                />
              </div>
            );
          case 'speaker-right':
            return (
              <div className="w-full h-full">
                <SpeakerLayout participantsBarPosition="left" />
              </div>
            );
          default:
            return (
              <div className="w-full h-full">
                <SpeakerLayout participantsBarPosition="right" />
              </div>
            );
        }
      };

      return (
        <section className="relative h-screen w-full overflow-hidden pt-2 sm:pt-4 text-white bg-gradient-to-b from-gray-900 to-black">

            <ParticipantCount />

            <Button className='ml-2 sm:ml-5 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 rounded-2xl sm:rounded-3xl px-3 py-2 sm:px-6 sm:py-3 shadow-lg transition-all duration-300 border border-blue-400/20 text-sm sm:text-base'
                onClick={() => {
                    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}${pathname}`
                    navigator.clipboard.writeText(meetingLink);
                    toast('Meeting Link Copied',{ 
                    duration: 3000,
                    className: '!bg-gray-300 !rounded-3xl !py-8 !px-5 !justify-center',
                });
                }}
                >
                    <span className="hidden sm:inline">📋 Invite People</span>
                    <span className="sm:hidden">📋 Invite</span>
            </Button>


            <div className="relative flex size-full items-center justify-center px-2 sm:px-4">
                <div className="flex size-full max-w-[1200px] items-center animate-fade-in">
                <CallLayout/>
                </div>
                <div
                className={cn('h-[calc(100vh-120px)] sm:h-[calc(100vh-86px)] hidden ml-2 sm:ml-4 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl w-full max-w-[300px] sm:max-w-[350px]', {
                    'show-block': showParticipants,
                })}
                >
                <CallParticipantsList onClose={() => setShowParticipants(false)} />
                </div>
            </div>

            {/* call controls */}
            <div className="fixed bottom-0 left-0 right-0 flex w-full items-center justify-center gap-2 sm:gap-4 pb-2 sm:pb-6 px-2 sm:px-4">
                <div className="flex items-center gap-2 sm:gap-4 bg-black/20 backdrop-blur-md rounded-2xl sm:rounded-3xl px-3 py-3 sm:px-6 sm:py-4 border border-white/10 shadow-2xl">
                    <CallControls onLeave={() => router.push(`/`)} />

                    <DropdownMenu>
                    <div className="flex items-center">
                        <DropdownMenuTrigger className="cursor-pointer rounded-xl sm:rounded-2xl bg-gradient-to-r from-gray-700 to-gray-800 px-3 py-2 sm:px-4 sm:py-3 hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg border border-gray-600/20">
                        <LayoutList size={18} className="text-white sm:w-5 sm:h-5" />
                        </DropdownMenuTrigger>
                    </div>
                    <DropdownMenuContent className="border-gray-700 bg-gray-800 text-white rounded-xl shadow-xl">
                        {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
                        <div key={index}>
                            <DropdownMenuItem
                            onClick={() =>
                                setLayout(item.toLowerCase() as CallLayoutType)
                            }
                            className="hover:bg-gray-700 rounded-lg transition-colors"
                            >
                            {item}
                            </DropdownMenuItem>
                            {index < 2 && <DropdownMenuSeparator className="border-gray-600" />}
                        </div>
                        ))}
                    </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <CallStatsButton />
                    
                    <button onClick={() => setShowParticipants((prev) => !prev)}>
                    <div className="cursor-pointer rounded-xl sm:rounded-2xl bg-gradient-to-r from-gray-700 to-gray-800 px-3 py-2 sm:px-4 sm:py-3 hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg border border-gray-600/20">
                        <Users size={18} className="text-white sm:w-5 sm:h-5" />
                    </div>
                    </button>
                    
                    <EndCallButton />
                </div>
            </div>
         </section>
      )


}

export default MeetingRoom

