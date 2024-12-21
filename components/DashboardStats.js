'use client';

import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { useUser } from '@clerk/nextjs';

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalDocuments: 0,
    recentUploads: 0,
    pendingTasks: 0,
    pendingDocs: 0,
    pendingTax: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }

        const pendingResponse = await fetch('/api/documents/pending-count');
        if (pendingResponse.ok) {
          const pendingData = await pendingResponse.json();
          setStats(prev => ({
            ...prev,
            pendingDocs: pendingData.documents,
            pendingTax: pendingData.taxInquiries
          }));
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">סך הכל מסמכים</h3>
        <p className="text-3xl font-bold text-[#B78628]">{stats.totalDocuments}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">העלאות אחרונות</h3>
        <p className="text-3xl font-bold text-[#B78628]">{stats.recentUploads}</p>
      </div>
     {isAdmin &&  <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">משימות בהמתנה</h3>
        <p className="text-3xl font-bold text-[#B78628]">{stats.pendingDocs + stats.pendingTax}</p>
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
      </div>}
    </div>
  );
} 

