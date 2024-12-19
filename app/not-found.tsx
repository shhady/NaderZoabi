import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-[#2C3E50] mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mb-8">הדף לא נמצא</h2>
      <p className="text-gray-500 mb-8">
        מצטערים, הדף שחיפשת אינו קיים.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#B78628] text-white rounded-md hover:bg-[#96691E] transition-colors"
      >
        חזרה לדף הבית
      </Link>
    </div>
  );
} 