'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function DashboardStats() {
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalDocuments: 0,
    pendingDocs: 0,
    pendingTax: 0
  });
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.publicMetadata?.role === 'admin';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-4">טוען...</div>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-[#2C3E50] mb-2">
          {isAdmin ? 'סה"כ מסמכים במערכת' : 'סה"כ מסמכים שלי'}
        </h3>
        <p className="text-3xl font-bold text-[#B78628]">
          {stats.totalDocuments}
        </p>
      </div>

      {isAdmin && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">משימות בהמתנה</h3>
          <p className="text-3xl font-bold text-[#B78628]">
            {stats.pendingDocs + stats.pendingTax}
          </p>
          <div className="mt-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>מסמכים:</span>
              <span>{stats.pendingDocs}</span>
            </div>
            <div className="flex justify-between">
              <span>שאילתות מס:</span>
              <span>{stats.pendingTax}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 

