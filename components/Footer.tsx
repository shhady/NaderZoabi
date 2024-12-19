export default function Footer() {
  return (
    <footer className="bg-[#2C3E50] border-t border-[#B78628]/20 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-gray-300">
          <p>© {new Date().getFullYear()} AccountantPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 