'use client'

import React from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';

const UserImageDebug: React.FC = () => {
  const { user } = useUser();

  if (!user) {
    return <div className="p-4 bg-red-100 text-red-800">No user data available</div>;
  }

  return (
    <div className="fixed top-4 left-4 p-4 bg-black/90 text-white rounded-lg max-w-md z-50 text-xs">
      <h3 className="font-bold mb-2">User Debug Info</h3>
      <div className="space-y-1">
        <div><strong>ID:</strong> {user.id}</div>
        <div><strong>Name:</strong> {user.firstName || user.username || 'Unknown'}</div>
        <div><strong>Image URL:</strong> {user.imageUrl || 'None'}</div>
        <div><strong>Has Image:</strong> {user.imageUrl ? 'Yes' : 'No'}</div>
      </div>
      
      {user.imageUrl && (
        <div className="mt-4">
          <div className="font-bold mb-2">Image Test:</div>
          <div className="flex items-center gap-4">
            <div>
              <div className="text-xs mb-1">Next.js Image:</div>
              <Image
                src={user.imageUrl}
                alt="User"
                width={40}
                height={40}
                className="rounded-full ring-2 ring-white"
                onLoad={() => console.log('✅ Image loaded via Next.js Image')}
                onError={() => console.log('❌ Image failed via Next.js Image')}
              />
            </div>
            <div>
              <div className="text-xs mb-1">Regular img:</div>
              <img
                src={user.imageUrl}
                alt="User"
                className="w-10 h-10 rounded-full ring-2 ring-white"
                onLoad={() => console.log('✅ Image loaded via regular img')}
                onError={() => console.log('❌ Image failed via regular img')}
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="text-xs mt-2 opacity-75">
        Check browser console for image loading logs
      </div>
    </div>
  );
};

export default UserImageDebug;