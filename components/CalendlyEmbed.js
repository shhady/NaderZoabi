'use client';

import { useUser } from '@clerk/clerk-react';
import { InlineWidget } from 'react-calendly';
export function CalendlyEmbed() {
    const { isLoaded, isSignedIn, user } = useUser();
  
    // Default prefill data
    const prefillData = {
      email: '',
      firstName: '',
      lastName: '',
      name: '',
    };
  
    // Update prefill data if user is signed in
    if (isLoaded && isSignedIn && user) {
      prefillData.email = user.emailAddresses[0]?.emailAddress || '';
      prefillData.firstName = user.firstName || '';
      prefillData.lastName = user.lastName || '';
      prefillData.name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
  
    return (
      <div className="calendly-inline-widget lg:h-[100%] h-[100%] w-full"  style={{ minWidth: '320px' }}>
        <InlineWidget
          url="https://calendly.com/shhadyse/30min"
          styles={{
            height: '840px',
            width: '100%',
          }}
          prefill={prefillData}
        />
      </div>
    );
  }
  