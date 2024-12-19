import Image from 'next/image';
import Link from 'next/link';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="gradient-bg py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our Services
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Comprehensive financial solutions tailored to your business needs
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100"
            >
              <div className="p-8">
                <div className="w-16 h-16 bg-[#2C3E50]/5 rounded-lg flex items-center justify-center mb-6">
                  <Image
                    src={service.icon}
                    alt={service.title}
                    width={32}
                    height={32}
                    className="text-[#B78628]"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-[#2C3E50] mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <span className="w-2 h-2 bg-[#B78628] rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/contact?service=${service.title}`}
                  className="inline-block px-6 py-3 bg-[#B78628] text-white rounded-md hover:bg-[#96691E] transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#2C3E50] mb-6">
            Need a Custom Solution?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Contact us to discuss how we can tailor our services to meet your specific needs
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-[#B78628] text-white rounded-md hover:bg-[#96691E] transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}

const services = [
  {
    icon: '/file.svg',
    title: 'Tax Planning & Preparation',
    description: 'Strategic tax planning and preparation services for individuals and businesses.',
    features: [
      'Tax Return Preparation',
      'Tax Planning Strategies',
      'IRS Representation',
      'State & Local Taxes'
    ]
  },
  {
    icon: '/globe.svg',
    title: 'Business Consulting',
    description: 'Expert guidance to help your business grow and succeed.',
    features: [
      'Business Strategy',
      'Financial Analysis',
      'Growth Planning',
      'Risk Assessment'
    ]
  },
  {
    icon: '/window.svg',
    title: 'Financial Reporting',
    description: 'Comprehensive financial reporting and analysis services.',
    features: [
      'Financial Statements',
      'Cash Flow Analysis',
      'Budgeting',
      'Forecasting'
    ]
  },
  {
    icon: '/chart.svg',
    title: 'Bookkeeping',
    description: 'Accurate and timely bookkeeping services for your business.',
    features: [
      'Monthly Reconciliation',
      'Payroll Services',
      'Accounts Payable',
      'Accounts Receivable'
    ]
  },
  {
    icon: '/users.svg',
    title: 'Business Formation',
    description: 'Help with establishing and structuring your business.',
    features: [
      'Entity Selection',
      'Business Registration',
      'Compliance Setup',
      'Licensing Assistance'
    ]
  },
  {
    icon: '/shield.svg',
    title: 'Audit & Assurance',
    description: 'Professional audit and assurance services.',
    features: [
      'Financial Audits',
      'Internal Controls',
      'Compliance Reviews',
      'Risk Assessment'
    ]
  }
]; 