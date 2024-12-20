'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function TaxInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.publicMetadata?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    fetchInquiries();
  }, [user, router, selectedMonth]);

  const fetchInquiries = async () => {
    try {
      let url = '/api/tax-inquiries';
      if (selectedMonth) {
        url += `?month=${selectedMonth}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setInquiries(data);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/tax-inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const updatedInquiry = await response.json();
        if (selectedInquiry?._id === id) {
          setSelectedInquiry(updatedInquiry);
        }
        setInquiries(prev => 
          prev.map(inquiry => 
            inquiry._id === id ? updatedInquiry : inquiry
          )
        );
      }
    } catch (error) {
      console.error('Error updating inquiry:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'in-progress': return 'text-blue-600';
      case 'completed': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'ממתין';
      case 'in-progress': return 'בטיפול';
      case 'completed': return 'הושלם';
      default: return status;
    }
  };

  if (loading) {
    return <div className="text-center py-10">טוען...</div>;
  }

  if (selectedInquiry) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-[#2C3E50]">פרטי הפנייה</h2>
          <button
            onClick={() => setSelectedInquiry(null)}
            className="text-gray-600 hover:text-[#B78628]"
          >
            חזור לרשימה
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-3">פרטי קשר</h3>
              <p className="mb-2 break-words">
                <span className="font-medium">שם:</span> {selectedInquiry.contactName}
              </p>
              <p className="mb-2">
                <span className="font-medium">טלפון:</span> {selectedInquiry.contactPhone}
              </p>
              <p className="mb-2 break-words">
                <span className="font-medium">אימייל:</span> {selectedInquiry.contactEmail}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">פרטי הכנסה</h3>
              <p>הכנסה שנתית: ₪{selectedInquiry.annualIncome}</p>
              <p>חודשי עבודה: {selectedInquiry.monthsWorked}</p>
              <p>הפרשות לפנסיה: ₪{selectedInquiry.pensionContributions}</p>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">סטטוס</h3>
            <select
              value={selectedInquiry.status}
              onChange={(e) => updateInquiryStatus(selectedInquiry._id, e.target.value)}
              className="mt-1 px-2 py-1 border rounded-md focus:ring-2 focus:ring-[#B78628]"
            >
              <option value="pending">ממתין</option>
              <option value="in-progress">בטיפול</option>
              <option value="completed">הושלם</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#2C3E50]">ניהול פניות להחזרי מס</h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 w-1/2">שם</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 w-1/4">סטטוס</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 w-1/4">פעולות</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inquiries.map((inquiry) => (
              <tr key={inquiry._id}>
                <td className="px-4 py-3">
                  <div className="text-sm leading-5 text-gray-900 break-words">
                    {inquiry.contactName}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`${getStatusColor(inquiry.status)} text-sm`}>
                    {getStatusText(inquiry.status)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedInquiry(inquiry)}
                    className="text-[#B78628] hover:text-[#96691E] text-sm"
                  >
                    צפה בפרטים
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 