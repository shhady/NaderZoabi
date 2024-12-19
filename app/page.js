import { CalendlyEmbed } from "../components/CalendlyEmbed";

export default function Home() {
  return (
    <main className="min-h-screen" dir="rtl">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#2C3E50] to-[#1a2530] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            משרד רואי חשבון זועבי
          </h1>
          <p className="text-xl mb-8">
            פתרונות חשבונאות מקצועיים לעסקים ויחידים
          </p>
          <a
            href="/contact"
            className="bg-[#B78628] text-white px-8 py-3 rounded-md hover:bg-[#96691E] transition-colors"
          >
            צור קשר
          </a>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#2C3E50] mb-12">
            אודותינו
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Team Members */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#2C3E50] mb-4">
                  נאדר זועבי
                </h3>
                <p className="text-gray-600">
                  רואה חשבון מוסמך עם ניסיון של למעלה מ-15 שנה בתחום. מתמחה בייעוץ מס, 
                  ביקורת דוחות כספיים, וליווי עסקים. בוגר האוניברסיטה העברית בירושלים, 
                  חבר לשכת רואי החשבון בישראל.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#2C3E50] mb-4">
                  מגד זועבי
                </h3>
                <p className="text-gray-600">
                  רואה חשבון מוסמך המתמחה בליווי עסקים קטנים ובינוניים, תכנון מס, 
                  וייעוץ פיננסי. בעל ניסיון עשיר בעבודה מול רשויות המס ומוסדות פיננסיים. 
                  בוגר אוניברסיטת תל אביב.
                </p>
              </div>
            </div>

            {/* Services & Office Info */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#2C3E50] mb-4">
                  השירותים שלנו
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>ייעוץ מס וחשבונאות</li>
                  <li>ביקורת דוחות כספיים</li>
                  <li>תכנון מס אסטרטגי</li>
                  <li>ליווי עסקי שוטף</li>
                  <li>הנהלת חשבונות</li>
                  <li>ייצוג מול רשויות המס</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#2C3E50] mb-4">
                  המשרד שלנו
                </h3>
                <p className="text-gray-600">
                  משרדנו, הממוקם במרכז הארץ, מספק שירותי ראיית חשבון וייעוץ פיננסי 
                  מקצועיים כבר למעלה מ-15 שנה. אנו מאמינים במתן שירות אישי, מקצועי 
                  ואיכותי לכל לקוח, תוך שמירה על סטנדרטים גבוהים ועמידה בכל דרישות החוק.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div>
        <CalendlyEmbed />
      </div>
    </main>
  );
} 