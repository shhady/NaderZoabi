'use client'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Navbar() {
  const { user, isLoaded } = useUser();

  console.log(user)
  useEffect(() => {
    const createUserInDb = async () => {
      if (user) {
        try {
          const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              clerkId: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.publicMetadata.role || 'client'
            }),
          });

          if (!response.ok && response.status !== 400) {
            console.error('Failed to create user in database');
          }
        } catch (error) {
          console.error('Error creating user:', error);
        }
      }
    };

    if (user) {
      createUserInDb();
    }
  }, [user]);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold text-[#2C3E50]">
            Accountant Portal
          </Link>

          <div className="flex items-center space-x-4">
            {!isLoaded ? null : !user ? (
              <>
                <SignInButton mode="modal">
                  <button className="text-gray-600 hover:text-gray-900">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-[#B78628] text-white px-4 py-2 rounded-md hover:bg-[#96691E]">
                    Sign Up
                  </button>
                </SignUpButton>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/dashboard" 
                  className="text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 