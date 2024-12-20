import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#2C3E50] text-white py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">צור קשר</h3>
            <div className="space-y-2">
              <p>טלפון: 054-1234567</p>
              <p>אימייל: info@accountant.co.il</p>
              <p>כתובת: רחוב הרצל 1, תל אביב</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">שעות פעילות</h3>
            <div className="space-y-2">
              <p>ראשון - חמישי: 9:00 - 17:00</p>
              <p>שישי: 9:00 - 13:00</p>
              <p>שבת: סגור</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">קישורים מהירים</h3>
            <div className="space-y-2">
              <p><Link href="/services" className="hover:text-[#B78628]">שירותים</Link></p>
              <p><Link href="/blog" className="hover:text-[#B78628]">בלוג</Link></p>
              <p><Link href="/contact" className="hover:text-[#B78628]">צור קשר</Link></p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-600 text-center">
          <p>© {new Date().getFullYear()} משרד רואי חשבון זועבי. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
} 