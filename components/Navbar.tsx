'use client'
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  const { isSignedIn, user } = useUser();

  return (
    <nav className="bg-[#2C3E50] border-b border-[#B78628]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-[#B78628] text-xl font-bold">
              AccountantPro
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link href="/services" className="text-gray-300 hover:text-[#B78628]">
                Services
              </Link>
              <Link href="/blog" className="text-gray-300 hover:text-[#B78628]">
                Blog
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-[#B78628]">
                Contact
              </Link>
              {isSignedIn && (
                <Link href="/dashboard" className="text-gray-300 hover:text-[#B78628]">
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <button className="bg-[#B78628] text-white px-4 py-2 rounded-md">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 