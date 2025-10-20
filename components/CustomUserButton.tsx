'use client'

import { useUser, useClerk } from '@clerk/nextjs'
import { useState } from 'react'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const CustomUserButton = () => {
  const { user } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    
    try {
      await signOut()
      toast('Signed out successfully', {
        duration: 2000,
        className: '!bg-green-600 !text-white !font-semibold !rounded-3xl !py-8 !px-5 !justify-center !shadow-lg !border !border-green-500/20',
      })
      // Force a router refresh to update the UI immediately
      router.refresh()
    } catch (error) {
      console.error('Sign out error:', error)
      toast('Error signing out. Please try again.', {
        duration: 3000,
        className: '!bg-red-600 !text-white !font-semibold !rounded-3xl !py-8 !px-5 !justify-center !shadow-lg !border !border-red-500/20',
      })
    } finally {
      setIsSigningOut(false)
    }
  }

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-12 w-12 rounded-full hover:bg-gray-300 transition-colors"
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          ) : (
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-semibold text-lg">
              {user.firstName?.charAt(0) || user.username?.charAt(0) || 'U'}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56 bg-white border border-gray-200 rounded-xl shadow-lg" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.firstName && user.lastName && (
              <p className="font-medium text-sm">
                {user.firstName} {user.lastName}
              </p>
            )}
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
        
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CustomUserButton
