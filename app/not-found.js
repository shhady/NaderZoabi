export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">404 - הדף לא נמצא</h2>
        <p className="text-gray-600 mb-4">הדף שחיפשת אינו קיים</p>
        <a
          href="/"
          className="bg-[#B78628] text-white px-4 py-2 rounded hover:bg-[#96691E]"
        >
          חזור לדף הבית
        </a>
      </div>
    </div>
  );
} 