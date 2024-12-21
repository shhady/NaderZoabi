'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import NamePrompt from './NamePrompt';

export default function DashboardHeader() {
  const { user } = useUser();
  const [dbUser, setDbUser] = useState(null);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserFromDb();
    }
  }, [user]);

  const fetchUserFromDb = async () => {
    try {
      const response = await fetch(`/api/users/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setDbUser(data);
        
        // Show name prompt if no name in DB
        if (!data?.firstName || !data?.lastName) {
          setShowNamePrompt(true);
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNameSubmit = async (nameData) => {
    setShowNamePrompt(false);
    // Refresh user data after name update
    fetchUserFromDb();
  };

  const displayName = dbUser?.firstName || user?.firstName || 'אורח';

  return (
    <>
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="py-6 md:py-4 pt-20 md:pt-4">
            <h1 className="text-xl font-semibold text-[#2C3E50] text-center md:text-right">
              ברוך הבא, {loading ? '...' : displayName}
            </h1>
          </div>
        </div>
      </div>

      {showNamePrompt && (
        <NamePrompt
          onSubmit={handleNameSubmit}
          onClose={() => setShowNamePrompt(false)}
        />
      )}
    </>
  );
} 