'use client'

import { useClerk } from '@clerk/nextjs'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const SignOutHandler = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { signOut: _ } = useClerk() // Mark as intentionally unused
  const router = useRouter()

  useEffect(() => {
    // Listen for sign-out events
    const handleSignOut = () => {
      // Force a router refresh to update the UI immediately
      router.refresh()
    }

    // Add event listener for sign-out
    window.addEventListener('clerk:signOut', handleSignOut)

    return () => {
      window.removeEventListener('clerk:signOut', handleSignOut)
    }
  }, [router])

  return null // This component doesn't render anything
}

export default SignOutHandler
