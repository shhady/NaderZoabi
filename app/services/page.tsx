import Image from 'next/image';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-[#2C3E50] mb-12">
          השירותים שלנו
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="w-12 h-12 mb-4">
                  <Image
                    src={service.icon}
                    alt={service.title}
                    width={48}
                    height={48}
                    className="text-[#B78628]"
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-[#2C3E50]">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <span className="ml-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const services = [
  {
    icon: '/icons/tax.svg',
    title: 'הכנת דוחות מס',
    description: 'שירותי מס מקיפים לעסקים ויחידים',
    features: [
      'הכנת דוחות מס שנתיים',
      'תכנון מס אסטרטגי',
      'ייצוג מול רשויות המס',
      'החזרי מס',
      'דיווחי מע"מ'
    ]
  },
  {
    icon: '/icons/accounting.svg',
    title: 'שירותי הנהלת חשבונות',
    description: 'ניהול פיננסי מקצועי לעסק שלך',
    features: [
      'הנהלת חשבונות שוטפת',
      'דוחות כספיים',
      'ניהול תזרים מזומנים',
      'תקציב וחיזוי פיננסי',
      'ניתוח עלויות'
    ]
  },
  {
    icon: '/icons/consulting.svg',
    title: 'ייעוץ עסקי',
    description: 'ייעוץ אסטרטגי להצלחת העסק',
    features: [
      'תכנון עסקי',
      'ניתוח כדאיות',
      'ליווי עסקי שוטף',
      'פיתוח אסטרטגיה',
      'ייעוץ פיננסי'
    ]
  },
  {
    icon: '/icons/payroll.svg',
    title: 'שכר וכוח אדם',
    description: 'ניהול מערך השכר בארגון',
    features: [
      'חישובי שכר',
      'תלושי משכורת',
      'דיווחי ביטוח לאומי',
      'טיפול בזכויות עובדים',
      'ייעוץ בדיני עבודה'
    ]
  }
]; 