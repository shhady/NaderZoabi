'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useUser } from '@clerk/nextjs';

export default function TaxInquiryDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const isAdmin = user?.publicMetadata?.role === 'admin';

  const statusOptions = [
    { value: 'ממתין', label: 'ממתין' },
    { value: 'בטיפול', label: 'בטיפול' },
    { value: 'הושלם', label: 'הושלם' }
  ];

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

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/tax-inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedInquiry = await response.json();
      setInquiry(updatedInquiry);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('שגיאה בעדכון הסטטוס');
    } finally {
      setUpdating(false);
    }
  };

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

      {/* Status Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">סטטוס הפנייה</h2>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(inquiry.status)}`}>
              {inquiry.status}
            </span>
            {isAdmin && (
              <select
                value={inquiry.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating}
                className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628] disabled:opacity-50"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Inquiry Details */}
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
            <p><span className="font-medium">הכנסה שנתית:</span> ₪{inquiry.annualIncome.toLocaleString()}</p>
            <p><span className="font-medium">חודשי עבודה:</span> {inquiry.monthsWorked}</p>
            <p><span className="font-medium">הפרשות לפנסיה:</span> ₪{(inquiry.pensionContributions || 0).toLocaleString()}</p>
            <p><span className="font-medium">טופס 106:</span> {inquiry.has106 ? 'יש' : 'אין'}</p>
            <p><span className="font-medium">מעסיקים מרובים:</span> {inquiry.hasMultipleEmployers ? 'כן' : 'לא'}</p>
          </div>

          {/* Personal Status */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">מצב אישי</h2>
            <p><span className="font-medium">מצב משפחתי:</span> {inquiry.maritalStatus}</p>
            <p><span className="font-medium">ילדים מתחת לגיל 18:</span> {inquiry.childrenUnder18 || 0}</p>
            <p><span className="font-medium">ילדים מתחת לגיל 5:</span> {inquiry.childrenUnder5 || 0}</p>
            <p><span className="font-medium">הורה יחיד:</span> {inquiry.singleParent ? 'כן' : 'לא'}</p>
            {inquiry.newImmigrant && (
              <p><span className="font-medium">שנת עלייה:</span> {inquiry.immigrationYear}</p>
            )}
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">פרטים נוספים</h2>
            {inquiry.academicDegree && (
              <>
                <p><span className="font-medium">תואר אקדמי:</span> {inquiry.degreeType}</p>
                <p><span className="font-medium">שנת סיום:</span> {inquiry.completionYear}</p>
              </>
            )}
            {inquiry.liveInPriorityArea && (
              <p><span className="font-medium">אזור עדיפות לאומית:</span> {inquiry.priorityAreaName}</p>
            )}
            <p><span className="font-medium">מצב רפואי מיוחד:</span> {inquiry.hasMedicalCondition ? 'כן' : 'לא'}</p>
            <p><span className="font-medium">בן משפחה נכה:</span> {inquiry.hasDisabledFamilyMember ? 'כן' : 'לא'}</p>
          </div>

          {/* Deductions & Credits */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">ניכויים וזיכויים</h2>
            {inquiry.paidChildcare && (
              <p><span className="font-medium">הוצאות טיפול בילדים:</span> ₪{inquiry.childcareAmount.toLocaleString()}</p>
            )}
            {inquiry.paidParentCare && (
              <p><span className="font-medium">הוצאות טיפול בהורים:</span> ₪{inquiry.parentCareAmount.toLocaleString()}</p>
            )}
            {inquiry.donationsAmount > 0 && (
              <p><span className="font-medium">תרומות:</span> ₪{inquiry.donationsAmount.toLocaleString()}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 