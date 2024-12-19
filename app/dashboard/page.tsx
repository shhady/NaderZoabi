import DashboardStats from '@/components/DashboardStats';
import DocumentsList from '@/components/DocumentsList';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#2C3E50] mb-8">לוח בקרה</h1>
        
        {/* Statistics */}
        <div className="mb-12">
          <DashboardStats />
        </div>

        {/* Recent Documents */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-[#2C3E50] mb-6">מסמכים אחרונים</h2>
          <DocumentsList />
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
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
    </div>
  );
} 