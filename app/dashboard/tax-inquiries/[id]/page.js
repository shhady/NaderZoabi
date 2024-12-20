'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function TaxInquiryDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        const response = await fetch(`/api/tax-inquiries/${id}`);
        if (response.ok) {
          const data = await response.json();
          setInquiry(data);
        }
      } catch (error) {
        console.error('Error fetching inquiry:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiry();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (!inquiry) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-red-600">הפנייה לא נמצאה</h1>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#2C3E50]">פרטי פנייה</h1>
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-[#B78628]"
        >
          חזור לרשימה
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">פרטי קשר</h2>
            <p><span className="font-medium">שם:</span> {inquiry.contactName}</p>
            <p><span className="font-medium">טלפון:</span> {inquiry.contactPhone}</p>
            <p><span className="font-medium">אימייל:</span> {inquiry.contactEmail}</p>
          </div>

          {/* Income Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">פרטי הכנסה</h2>
            <p><span className="font-medium">הכנסה שנתית:</span> ₪{inquiry.annualIncome}</p>
            <p><span className="font-medium">חודשי עבודה:</span> {inquiry.monthsWorked}</p>
            <p><span className="font-medium">הפרשות לפנסיה:</span> ₪{inquiry.pensionContributions || 0}</p>
          </div>

          {/* Personal Status */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">מצב אישי</h2>
            <p><span className="font-medium">מצב משפחתי:</span> {inquiry.maritalStatus}</p>
            <p><span className="font-medium">ילדים מתחת לגיל 18:</span> {inquiry.childrenUnder18 || 0}</p>
            <p><span className="font-medium">ילדים מתחת לגיל 5:</span> {inquiry.childrenUnder5 || 0}</p>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">סטטוס טיפול</h2>
            <select
              value={inquiry.status}
              onChange={async (e) => {
                try {
                  const response = await fetch(`/api/tax-inquiries/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: e.target.value }),
                  });
                  if (response.ok) {
                    const updatedInquiry = await response.json();
                    setInquiry(updatedInquiry);
                  }
                } catch (error) {
                  console.error('Error updating status:', error);
                }
              }}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
            >
              <option value="pending">ממתין</option>
              <option value="in-progress">בטיפול</option>
              <option value="completed">הושלם</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
} 