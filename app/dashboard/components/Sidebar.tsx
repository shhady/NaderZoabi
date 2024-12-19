'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';

  const links = [
    { href: '/dashboard', label: 'Overview', admin: false },
    { href: '/dashboard/files', label: 'My Files', admin: false },
    { href: '/dashboard/blog', label: 'Manage Blog', admin: true },
    { href: '/dashboard/users', label: 'User Management', admin: true },
    { href: '/dashboard/files/upload', label: 'Upload Files', admin: true },
  ].filter(link => !link.admin || isAdmin);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="mt-8">
        <div className="px-4 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  group flex items-center px-4 py-2 text-sm rounded-md
                  ${isActive
                    ? 'bg-[#2C3E50] text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
} 