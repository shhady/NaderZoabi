'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function TaxInquiriesPage() {
  const currentYear = new Date().getFullYear();
  const [inquiries, setInquiries] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.publicMetadata?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    fetchInquiries();
  }, [user, router, selectedMonth, selectedYear, selectedStatus]);

  const fetchInquiries = async () => {
    try {
      let url = '/api/tax-inquiries';
      const params = new URLSearchParams();

      if (selectedMonth) params.append('month', selectedMonth);
      if (selectedYear) params.append('year', selectedYear);
      if (selectedStatus) params.append('status', selectedStatus);

      if ([...params].length > 0) {
        url += `?${params.toString()}`;
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

  const months = [
    { value: '1', label: 'ינואר' },
    { value: '2', label: 'פברואר' },
    { value: '3', label: 'מרץ' },
    { value: '4', label: 'אפריל' },
    { value: '5', label: 'מאי' },
    { value: '6', label: 'יוני' },
    { value: '7', label: 'יולי' },
    { value: '8', label: 'אוגוסט' },
    { value: '9', label: 'ספטמבר' },
    { value: '10', label: 'אוקטובר' },
    { value: '11', label: 'נובמבר' },
    { value: '12', label: 'דצמבר' },
  ];

  const years = Array.from(
    { length: (currentYear + 1) - 2024 + 1 },
    (_, i) => ({ 
      value: (2024 + i).toString(), 
      label: (2024 + i).toString() 
    })
  );

  const statusOptions = [
    { value: 'pending', label: 'ממתין' },
    { value: 'in-progress', label: 'בטיפול' },
    { value: 'completed', label: 'הושלם' }
  ];

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
        fetchInquiries();
      }
    } catch (error) {
      console.error('Error updating inquiry:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-10">טוען...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#2C3E50]">ניהול פניות להחזרי מס</h1>

      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              סנן לפי חודש
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
            >
              <option value="">כל החודשים</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              סנן לפי שנה
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
            >
              <option value="">כל השנים</option>
              {years.map((year) => (
                <option key={year.value} value={year.value}>
                  {year.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              סנן לפי סטטוס
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
            >
              <option value="">כל הסטטוסים</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  שם
                </th>
                <th className="pl-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  סטטוס
                </th>
                <th className="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  פעולות
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                    לא נמצאו פניות
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr key={inquiry._id}>
                    <td className="px-3 md:px-6 py-4">
                      <div className="text-sm text-gray-900 break-words leading-5">
                        {inquiry.contactName}
                      </div>
                    </td>
                    <td className="pl-3 md:px-6 py-4">
                      <select
                        value={inquiry.status}
                        onChange={(e) => updateInquiryStatus(inquiry._id, e.target.value)}
                        className="w-full md:w-auto px-2 py-1 text-sm border rounded-md focus:ring-2 focus:ring-[#B78628]"
                      >
                        <option value="pending">ממתין</option>
                        <option value="in-progress">בטיפול</option>
                        <option value="completed">הושלם</option>
                      </select>
                    </td>
                    <td className="px-3 md:px-6 py-4">
                      <button
                        onClick={() => router.push(`/dashboard/tax-inquiries/${inquiry._id}`)}
                        className="text-[#B78628] hover:text-[#96691E] text-sm"
                      >
                        צפה בפרטים
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
