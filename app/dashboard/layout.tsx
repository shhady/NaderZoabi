'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'לוח בקרה', href: '/dashboard' },
  { name: 'מסמכים', href: '/dashboard/documents' },
  { name: 'העלאת קבצים', href: '/dashboard/files/upload' },
  { name: 'משתמשים', href: '/dashboard/users', adminOnly: true },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const pathname = usePathname();

  const isAdmin = user?.publicMetadata?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Navigation */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {navigation.map((item) => {
                if (item.adminOnly && !isAdmin) return null;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-4 border-b-2 text-sm font-medium ${
                      pathname === item.href
                        ? 'border-[#B78628] text-[#B78628]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <main>{children}</main>
    </div>
  );
} 