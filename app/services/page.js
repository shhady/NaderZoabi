export default function ServicesPage() {
    const services = [
      {
        title: 'ייעוץ מס',
        description: 'ייעוץ מס מקצועי לעסקים ויחידים, תכנון מס אסטרטגי והתמודדות עם רשויות המס.',
        features: [
          'תכנון מס אסטרטגי',
          'ייצוג מול רשויות המס',
          'החזרי מס',
          'ייעוץ מס לעסקאות נדל"ן'
        ],
        icon: '📊'
      },
      {
        title: 'ביקורת דוחות כספיים',
        description: 'ביקורת מקצועית של דוחות כספיים, הכנת דוחות שנתיים ותקופתיים.',
        features: [
          'ביקורת דוחות שנתיים',
          'דוחות מיוחדים',
          'חוות דעת מקצועית',
          'בדיקות נאותות'
        ],
        icon: '📑'
      },
      {
        title: 'הנהלת חשבונות',
        description: 'ניהול מערך הנהלת חשבונות מלא לעסקים, כולל דיווחים שוטפים ותקופתיים.',
        features: [
          'הנהלת חשבונות שוטפת',
          'דיווחים תקופתיים',
          'התאמות בנקים',
          'ניהול תזרים מזומנים'
        ],
        icon: '📘'
      },
      {
        title: 'תכנון וייעוץ כלכלי',
        description: 'עזרה בתכנון וניהול התקציב, הכנת תוכניות עסקיות וליווי פיננסי לעסקים ויחידים.',
        features: [
          'תכנון וניהול תקציב',
          'הכנת תוכניות עסקיות',
          'ייעוץ פיננסי אישי',
          'ליווי כלכלי לעסקים'
        ],
        icon: '💼'
      },
      {
        title: 'שירותי שכר',
        description: 'ניהול שכר לעובדים, דיווחים חודשיים לרשויות וניהול תנאים סוציאליים.',
        features: [
          'חישוב וניהול שכר',
          'דיווחים חודשיים למוסדות',
          'ניהול תנאים סוציאליים',
          'הפקת תלושי שכר'
        ],
        icon: '💰'
      },
      {
        title: 'שירותים לעסקים קטנים ובינוניים',
        description: 'תמיכה מלאה לעסקים קטנים ובינוניים, כולל ליווי פיננסי ושירותי ייעוץ מותאמים.',
        features: [
          'תמיכה בפתיחת עסק',
          'הגשת דוחות תקופתיים',
          'ליווי פיננסי כולל',
          'ייעוץ בנושאי מימון והשקעות'
        ],
        icon: '🏢'
      }
    ];
  
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#2C3E50] mb-4">
              השירותים שלנו
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              מתן שירותים מקצועיים ואיכותיים בתחום ראיית החשבון, ייעוץ המס והליווי הפיננסי
            </p>
          </div>
  
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold text-[#2C3E50] mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <span className="ml-2">✔</span>
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
  