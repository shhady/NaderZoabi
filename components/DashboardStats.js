'use client';

import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalDocuments: 0,
    recentUploads: 0,
    pendingTasks: 0
  });
  const [loading, setLoading] = useState(true);

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
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">משימות בהמתנה</h3>
        <p className="text-3xl font-bold text-[#B78628]">{stats.pendingTasks}</p>
      </div>
    </div>
  );
} 