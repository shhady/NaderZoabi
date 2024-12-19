'use client';

import { useState } from 'react';
import { CalendlyEmbed } from '@/components/CalendlyEmbed';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-[#2C3E50] mb-12">
          צור קשר
        </h1>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
            {/* Contact Form */}
            <div className="p-8 w-full md:w-1/2">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">פרטי התקשרות</h3>
                  <div className="space-y-4">
                    <p className="flex items-center">
                      <span className="ml-2">📞</span>
                      054-1234567
                    </p>
                    <p className="flex items-center">
                      <span className="ml-2">✉️</span>
                      info@accountant.co.il
                    </p>
                    <p className="flex items-center">
                      <span className="ml-2">📍</span>
                      רחוב הרצל 1, תל אביב
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">שעות פעילות</h3>
                  <div className="space-y-2">
                    <p>ראשון - חמישי: 9:00 - 17:00</p>
                    <p>שישי: 9:00 - 13:00</p>
                    <p>שבת: סגור</p>
                  </div>
                </div>
              </div>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      שם מלא
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
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
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    נושא
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
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

            {/* Calendly Embed */}
            <div className="bg-white rounded-lg shadow-lg p-8 w-full md:w-1/2">
              <h2 className="text-2xl font-semibold text-[#2C3E50] mb-6">
                קביעת פגישת ייעוץ
              </h2>
              <CalendlyEmbed />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
