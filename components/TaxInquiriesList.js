'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

export default function TaxInquiriesList({ hideFilters = false, limit }) {
  const { user } = useUser();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nameFilter, setNameFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const isAdmin = user?.publicMetadata?.role === 'admin';

  useEffect(() => {
    fetchInquiries();
  }, [limit]);

  const fetchInquiries = async () => {
    try {
      let url = '/api/tax-inquiries';
      if (limit) {
        url += `?limit=${limit}`;
      }
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setInquiries(data);
      }
    } catch (error) {
      console.error('Error fetching tax inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'ממתין':
        return 'bg-yellow-100 text-yellow-800';
      case 'בטיפול':
        return 'bg-blue-100 text-blue-800';
      case 'הושלם':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusOptions = [
    { value: '', label: 'כל הסטטוסים' },
    { value: 'ממתין', label: 'ממתין' },
    { value: 'בטיפול', label: 'בטיפול' },
    { value: 'הושלם', label: 'הושלם' }
  ];

  // Filter inquiries
  const filteredInquiries = inquiries.filter(inquiry => {
    const inquiryDate = new Date(inquiry.createdAt);
    const matchesName = inquiry.contactName?.toLowerCase().includes(nameFilter.toLowerCase());
    const matchesYear = !yearFilter || inquiryDate.getFullYear().toString() === yearFilter;
    const matchesMonth = !monthFilter || (inquiryDate.getMonth() + 1).toString() === monthFilter;
    const matchesStatus = !statusFilter || inquiry.status === statusFilter;
    
    return matchesName && matchesYear && matchesMonth && matchesStatus;
  });

  // Get unique years
  const years = [...new Set(inquiries.map(inquiry => 
    new Date(inquiry.createdAt).getFullYear()
  ))].sort((a, b) => b - a);

  // Get months
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(2024, i, 1).toLocaleString('he-IL', { month: 'long' })
  }));

  if (loading) {
    return <div className="text-center py-4">טוען...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      {!hideFilters && (
        <div className="bg-white rounded-lg shadow">
          {/* Mobile Accordion Header - Always visible on mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="w-full p-4 flex items-center justify-between"
            >
              <span className="font-medium text-gray-700">סינון שאילתות</span>
              {isFiltersOpen ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>

          {/* Filters Content */}
          <div className={`
            ${isFiltersOpen ? 'block' : 'hidden'} md:block
            border-t md:border-t-0 p-4 md:p-6
          `}>
            {/* Mobile: Stack filters vertically */}
            <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-4 md:gap-4">
              {/* Name Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  חיפוש לפי שם
                </label>
                <input
                  type="text"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  placeholder="הקלד שם לחיפוש..."
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
                />
              </div>

              {/* Year Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  סנן לפי שנה
                </label>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
                >
                  <option value="">כל השנים</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Month Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  סנן לפי חודש
                </label>
                <select
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
                >
                  <option value="">כל החודשים</option>
                  {months.map(month => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  סנן לפי סטטוס
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Summary - Mobile Only */}
            <div className="mt-4 md:hidden">
              <div className="flex flex-wrap gap-2">
                {nameFilter && (
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                    {nameFilter}
                  </span>
                )}
                {yearFilter && (
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                    שנה: {yearFilter}
                  </span>
                )}
                {monthFilter && (
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                    חודש: {months.find(m => m.value.toString() === monthFilter)?.label}
                  </span>
                )}
                {statusFilter && (
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                    סטטוס: {statusOptions.find(s => s.value === statusFilter)?.label}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tax Inquiries Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {filteredInquiries.length === 0 ? (
          <div className="col-span-full text-center py-10 bg-white rounded-lg shadow">
            <p className="text-gray-500">
              {(nameFilter || yearFilter || monthFilter || statusFilter)
                ? 'לא נמצאו שאילתות התואמות לחיפוש' 
                : 'אין שאילתות להצגה'}
            </p>
          </div>
        ) : (
          filteredInquiries.map((inquiry) => (
            <div 
              key={inquiry._id} 
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-lg">{inquiry.contactName}</h3>
                  <p className="text-sm text-gray-600">{inquiry.contactEmail}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-sm ${getStatusStyle(inquiry.status)}`}>
                  {inquiry.status}
                </span>
              </div>
              
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    הכנסה שנתית: ₪{inquiry.annualIncome.toLocaleString()}
                  </p>
                  <span className="text-sm text-gray-500">
                    {new Date(inquiry.createdAt).toLocaleDateString('he-IL')}
                  </span>
                </div>
              </div>

              <Link
                href={`/dashboard/tax-inquiries/${inquiry._id}`}
                className="text-[#B78628] hover:text-[#96691E] inline-block"
              >
                צפה בפרטים
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 