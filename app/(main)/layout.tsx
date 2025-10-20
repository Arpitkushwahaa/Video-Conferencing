import StreamProvider from "@/providers/StreamProvider"
import { SignIn, SignedIn, SignedOut } from "@clerk/nextjs"
import { neobrutalism } from "@clerk/themes"
import Image from "next/image"
import React from "react"
import AuthWrapper from "@/components/AuthWrapper"
import SignOutHandler from "@/components/SignOutHandler"

const MainLayout = ({
    children
}: {
    children: React.ReactNode
}
) => {
    return (
        <AuthWrapper>
            <SignOutHandler />
            <main className="animate-fade-in">
                <SignedOut>
                    <div className="flex flex-col items-center p-5 gap-10 animate-fade-in">
                        <section className="flex flex-col items-center">
                            <Image
                                src='/assets/logo.svg'
                                width={100}
                                height={100}
                                alt="Logo"
                            />
                            <h1 className="text-lg font-extrabold text-sky-1 lg:text-2xl">
                                Connect, Communicate, Collaborate in Real-Time
                            </h1>
                        </section>
                        <div className="mt-3">
                            <SignIn
                                routing="hash"
                                appearance={{
                                    baseTheme: neobrutalism
                                }}
                            />
                        </div>
                    </div>
                </SignedOut>
                
                <SignedIn>
                    <StreamProvider>
                        {children}
                    </StreamProvider>
                </SignedIn>
            </main>
        </AuthWrapper>
    )
}

export default MainLayout