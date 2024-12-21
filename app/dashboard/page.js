'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import DashboardStats from '@/components/DashboardStats';
import DocumentsList from '@/components/DocumentsList';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">טוען...</p>
      </div>
    );
  }

  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#2C3E50]">לוח בקרה</h1>
        <Link
          href="/dashboard/files/upload"
          className="bg-[#B78628] text-white px-4 py-2 rounded-md hover:bg-[#96691E] transition-colors"
        >
          העלאת קבצים
        </Link></div>
      <DashboardStats />

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#2C3E50]">מסמכים אחרונים</h2>
          <Link
            href="/dashboard/documents"
            className="text-[#B78628] hover:text-[#96691E]"
          >
            הצג הכל
          </Link>
        </div>
        <DocumentsList hideFilters={true} limit={6} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <a 
          href="/dashboard/files/upload"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-medium text-[#2C3E50] mb-2">העלאת מסמכים</h3>
          <p className="text-gray-600">העלה מסמכים חדשים למערכת</p>
        </a>
        
        <a 
          href="/services"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-medium text-[#2C3E50] mb-2">שירותים</h3>
          <p className="text-gray-600">צפה בשירותים הזמינים</p>
        </a>
        
        <a 
          href="/contact"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-medium text-[#2C3E50] mb-2">צור קשר</h3>
          <p className="text-gray-600">צור קשר עם צוות התמיכה</p>
        </a>
      </div>
    </div>
  );
} 