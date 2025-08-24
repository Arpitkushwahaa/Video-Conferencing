'use client'

import { useUser } from "@clerk/nextjs";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { ReactNode, useEffect, useState } from "react"
import { tokenProvider } from '@/actions/stream.actions';
import Loading from "@/components/Loading";


const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;


const StreamProvider = ({ children }: { children: ReactNode }) => {

    const [videoClient, setVideoClient] = useState<StreamVideoClient>();
    const { user, isLoaded } = useUser();

    useEffect(() => {
        if (!isLoaded || !user) return;
        if (!API_KEY) {
            console.warn('Stream API key is missing. Please add NEXT_PUBLIC_STREAM_API_KEY to your environment variables.');
            return;
        }
        
        const client = new StreamVideoClient({
            apiKey: API_KEY,
            user: {
              id: user?.id,
              name: user.firstName || user?.username || 'User',
              image: user?.imageUrl,
            },
            tokenProvider,
          });

          setVideoClient(client);
          return () => {
            client.disconnectUser();
            setVideoClient(undefined);
          };
    }, [user, isLoaded])

    if (!videoClient) {
        // If API key is missing, show a helpful message
        if (!API_KEY) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen p-4">
                    <div className="text-center space-y-4 max-w-md">
                        <h2 className="text-2xl font-bold text-gray-800">Setup Required</h2>
                        <p className="text-gray-600">
                            Please add your Stream API key to the environment variables.
                        </p>
                        <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono">
                            NEXT_PUBLIC_STREAM_API_KEY=your_api_key_here
                        </div>
                    </div>
                </div>
            );
        }
        return <Loading />;
    }

    return  <StreamVideo client={videoClient}>
                {children}
            </StreamVideo>

}

export default StreamProvider