'use client';

import dynamic from 'next/dynamic';
import { CalendlyEmbed } from '@/components/CalendlyEmbed';

const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '400px', width: '100%', background: '#f0f0f0' }} />
  ),
});

export default function ContactPage() {
  const testimonials = [
    {
      name: 'אחמד כהן',
      feedback:
        'שירות מצוין ומקצועי. זועבי נאדר עזר לי להבין את המצב הפיננסי שלי ולתכנן את המסים בצורה יעילה.',
    },
    {
      name: 'מירי לוי',
      feedback:
        'אני ממליצה בחום! נאדר והצוות שלו היו סבלניים וענו על כל השאלות שלי.',
    },
    {
      name: 'יוסף אבו יוסף',
      feedback:
        'שירות ברמה הגבוהה ביותר! קיבלתי החזרי מס בזמן ובצורה מסודרת.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-[#2C3E50] mb-4">
          צור קשר עם זועבי נאדר
        </h1>
        <p className="text-center text-lg text-gray-600 mb-12">
          זועבי נאדר - רואה חשבון מנוסה עם מעל 35 שנות ניסיון, מציע שירותים פיננסיים מותאמים אישית ללקוחות פרטיים ועסקיים.
        </p>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
            {/* טופס יצירת קשר */}
            <div className="p-8 w-full md:w-1/2">
            <div className="my-8">
                <h3 className="text-xl font-semibold mb-4">פרטי התקשרות</h3>
                <div className="space-y-4">
                  <p className="flex items-center">
                    <span className="ml-2">📞</span>
                    <a
                      href="tel:046465875"
                      className="text-[#2C3E50] hover:underline"
                    >
                      04-6465875
                    </a>
                  </p>
                  <p className="flex items-center">
                    <span className="ml-2">✉️</span>
                    <a
                      href="mailto:info@accountant.co.il"
                      className="text-[#2C3E50] hover:underline"
                    >
                      info@accountant.co.il
                    </a>
                  </p>
                  <p className="flex items-center">
                    <span className="ml-2">📍</span>
                    אכסאל 702, נצרת
                  </p>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-[#2C3E50] mb-6">
                השאר הודעה
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      שם מלא
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
                      placeholder="הזן את שמך המלא"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      אימייל
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
                      placeholder="example@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    מספר טלפון
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
                    placeholder="052-1234567"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    נושא
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
                    placeholder="על מה ברצונך להתייעץ?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    הודעה
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
                    placeholder="כתוב את ההודעה שלך כאן..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#B78628] text-white px-6 py-3 rounded-md hover:bg-[#96691E] transition-colors"
                >
                  שלח הודעה
                </button>
              </form>
              
            </div>

            {/* קביעת פגישה דרך Calendly */}
            <div className="bg-white rounded-lg shadow-lg p-8 w-full md:w-1/2 max-h-[100%] overflow-hidden">
              <h2 className="text-2xl font-semibold text-[#2C3E50] mb-6">
                קבע פגישה
              </h2>
              <p className="text-gray-600 mb-4">
                קבע פגישת ייעוץ מותאמת אישית עם רואה החשבון שלנו וקבל מענה מקצועי לכל שאלותיך.
              </p>
              <CalendlyEmbed />
            </div>
          </div>

          {/* Google Maps Embed */}
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-center text-[#2C3E50] mb-6">
              מיקום המשרד שלנו
            </h3>
            <Map />
          </div>

          {/* Testimonials Section */}
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-center text-[#2C3E50] mb-6">
              מה הלקוחות שלנו אומרים
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <p className="italic text-gray-600">&quot;{testimonial.feedback}&quot;</p>
                  <p className="mt-4 text-sm font-semibold text-[#2C3E50]">
                    - {testimonial.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
