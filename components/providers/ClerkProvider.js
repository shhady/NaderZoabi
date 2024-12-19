'use client';

import { ClerkProvider as Clerk } from '@clerk/nextjs';
import { clerkConfig } from '@/lib/clerk';

export function ClerkProvider({ children }) {
  return (
    <Clerk appearance={clerkConfig.appearance} localization={clerkConfig.localization}>
      {children}
    </Clerk>
  );
} 