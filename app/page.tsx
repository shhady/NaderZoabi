import Link from 'next/link';
import Image from 'next/image';
import { CalendlyEmbed } from '../components/CalendlyEmbed';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center gradient-bg">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Your Trusted Accounting Partner
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Professional financial guidance to help your business thrive in today's economy
          </p>
          <Link 
            href="#schedule"
            className="inline-block px-8 py-4 bg-[#B78628] text-white rounded-md hover:bg-[#96691E] transition-colors"
          >
            Schedule a Meeting
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2C3E50] mb-12">
            Our Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 mb-4">
                  <Image
                    src={service.icon}
                    alt={service.title}
                    width={48}
                    height={48}
                    className="text-[#B78628]"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#2C3E50]">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Section */}
      <section id="schedule" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2C3E50] mb-12">
            Schedule a Consultation
          </h2>
          <div className="max-w-4xl mx-auto">
            <CalendlyEmbed />
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2C3E50] mb-12">
            Latest Insights
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {blogPosts.map((post, index) => (
              <div 
                key={index}
                className="rounded-lg overflow-hidden border border-gray-200"
              >
                <div className="relative h-48">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-[#2C3E50]">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {post.excerpt}
                  </p>
                  <Link 
                    href={post.link}
                    className="text-[#B78628] hover:text-[#96691E] font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const services = [
  {
    icon: '/file.svg',
    title: 'Tax Planning',
    description: 'Strategic tax planning and preparation services to minimize your tax burden and ensure compliance.'
  },
  {
    icon: '/globe.svg',
    title: 'Business Consulting',
    description: 'Expert guidance on financial strategy, growth planning, and business operations.'
  },
  {
    icon: '/window.svg',
    title: 'Financial Reports',
    description: 'Comprehensive financial reporting and analysis to drive informed business decisions.'
  }
];

const blogPosts = [
  {
    title: '2024 Tax Changes You Need to Know',
    excerpt: 'Stay informed about the latest tax law changes and how they affect your business.',
    image: '/blog-1.jpg',
    link: '/blog/2024-tax-changes'
  },
  {
    title: 'Financial Planning for Small Businesses',
    excerpt: 'Essential financial planning strategies to help your small business succeed.',
    image: '/blog-2.jpg',
    link: '/blog/financial-planning'
  }
]; 