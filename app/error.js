'use client';

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">משהו השתבש</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={reset}
          className="bg-[#B78628] text-white px-4 py-2 rounded hover:bg-[#96691E]"
        >
          נסה שוב
        </button>
      </div>
    </div>
  );
} 