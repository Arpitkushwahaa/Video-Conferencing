'use client';
import { SignedIn } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { navLinks } from '@/constants';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import CustomUserButton from './CustomUserButton';


const NavBar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

    return (
        <>
          <nav className="flex justify-between items-center fixed z-50 w-full h-28 bg-gray-200 px-10 gap-4 shadow-2xl">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-1 hover:scale-150 duration-500 ">
                <Image
                  src="/assets/logo.svg"
                  width={60}
                  height={60}
                  alt="Let's talk"
                />
              </Link>

              {/* Nav Links - Desktop */}
              <section className="sticky top-0 flex justify-between text-black max-md:hidden">
                <div className="flex flex-1 max-sm:gap-0 sm:gap-6">
                  {navLinks.map((item) => {
                    const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
                    
                    return (
                      <Link
                        href={item.route}
                        key={item.label}
                        className={
                          cn('flex gap-4 items-center p-4 rounded-lg justify-start hover:scale-150 duration-300 ',
                            isActive && 'bg-blue-100 rounded-3xl'
                          )
                        }
                      >
                        <Image
                          src={item.imgURL}
                          alt={item.label}
                          width={24}
                          height={24}
                        />
                        
                        
                        
                        <p className={cn(
                            "text-lg font-semibold max-lg:hidden",
                          )}>
                          {item.label}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </section>

              {/* Mobile Hamburger Menu */}
              <div className="md:hidden">
                <button
                  onClick={toggleMenu}
                  className="p-2 rounded-lg hover:bg-gray-300 transition-colors"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? (
                    <X size={24} className="text-black" />
                  ) : (
                    <Menu size={24} className="text-black" />
                  )}
                </button>
              </div>

              {/* User button */}
              <div className='hover:scale-150 duration-500 '>
                <SignedIn>
                    <CustomUserButton />
                </SignedIn>
              </div>
          </nav>

          {/* Mobile Menu Overlay */}
          {isMenuOpen && (
            <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={closeMenu}>
              <div className="fixed top-28 left-0 right-0 bg-gray-200 shadow-2xl">
                <div className="flex flex-col py-4">
                  {navLinks.map((item) => {
                    const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
                    
                    return (
                      <Link
                        href={item.route}
                        key={item.label}
                        onClick={closeMenu}
                        className={
                          cn('flex items-center gap-4 px-10 py-4 text-black hover:bg-gray-300 transition-colors',
                            isActive && 'bg-blue-100'
                          )
                        }
                      >
                        <Image
                          src={item.imgURL}
                          alt={item.label}
                          width={24}
                          height={24}
                        />
                        
                        <span className="text-lg font-semibold">
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
    )
}

export default NavBar