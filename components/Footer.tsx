import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image 
                src="/assets/logo.svg" 
                alt="Let's Talk Logo" 
                width={32} 
                height={32}
                className="dark:filter dark:brightness-0 dark:invert"
              />
              <h3 className="text-xl font-bold">Let&apos;s Talk</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Experience seamless video conferencing with crystal-clear audio, 
              HD video quality, and intuitive features designed for modern communication.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Key Features</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center text-gray-400 hover:text-white transition-colors">
                <span className="mr-2">🎥</span>
                HD Video Conferencing
              </li>
              <li className="flex items-center text-gray-400 hover:text-white transition-colors">
                <span className="mr-2">🔒</span>
                Secure Meetings
              </li>
              <li className="flex items-center text-gray-400 hover:text-white transition-colors">
                <span className="mr-2">📱</span>
                Cross-platform Support
              </li>
              <li className="flex items-center text-gray-400 hover:text-white transition-colors">
                <span className="mr-2">💾</span>
                Meeting Recordings
              </li>
            </ul>
          </div>

          {/* Quick Access */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Access</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/my-room" 
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <Image src="/assets/my-room.svg" alt="My Room" width={16} height={16} className="mr-2 dark:filter dark:brightness-0 dark:invert" />
                  Personal Room
                </Link>
              </li>
              <li>
                <Link 
                  href="/upcoming" 
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <Image src="/assets/upcoming.svg" alt="Upcoming" width={16} height={16} className="mr-2 dark:filter dark:brightness-0 dark:invert" />
                  Scheduled Meetings
                </Link>
              </li>
              <li>
                <Link 
                  href="/recordings" 
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <Image src="/assets/recordings.svg" alt="Recordings" width={16} height={16} className="mr-2 dark:filter dark:brightness-0 dark:invert" />
                  Meeting Recordings
                </Link>
              </li>
              <li>
                <Link 
                  href="/previous" 
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <Image src="/assets/previous.svg" alt="Previous" width={16} height={16} className="mr-2 dark:filter dark:brightness-0 dark:invert" />
                  Meeting History
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Need Help?</h4>
            <div className="space-y-3 text-sm">
              <div className="space-y-2">
                <p className="text-gray-400">Technical Support</p>
                <p className="hover:text-white transition-colors cursor-pointer font-medium">
                  support@letstalk.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Let&apos;s Talk. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
