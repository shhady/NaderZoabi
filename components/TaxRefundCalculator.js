'use client';

import { useState } from 'react';

const STEPS = {
  INCOME: 0,
  PERSONAL: 1,
  DEDUCTIONS: 2,
  CONTACT: 3,
};

const inputProps = {
  suppressHydrationWarning: true,
  className: "w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]",
};

export default function TaxRefundCalculator() {
  const [currentStep, setCurrentStep] = useState(STEPS.INCOME);
  const [formData, setFormData] = useState({
    annualIncome: '',
    monthsWorked: '',
    has106: false,
    hasMultipleEmployers: false,
    pensionContributions: '',
    maritalStatus: 'single',
    childrenUnder18: '',
    childrenUnder5: '',
    singleParent: false,
    newImmigrant: false,
    immigrationYear: '',
    academicDegree: false,
    degreeType: '',
    completionYear: '',
    liveInPriorityArea: false,
    priorityAreaName: '',
    hasMedicalCondition: false,
    hasDisabledFamilyMember: false,
    paidChildcare: false,
    childcareAmount: '',
    paidParentCare: false,
    parentCareAmount: '',
    donationsAmount: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep !== STEPS.CONTACT) {
      nextStep();
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/tax-inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Something went wrong');
      }

      alert('הטופס נשלח בהצלחה!');
      setCurrentStep(STEPS.INCOME);
      setFormData({
        annualIncome: '',
        monthsWorked: '',
        has106: false,
        hasMultipleEmployers: false,
        pensionContributions: '',
        maritalStatus: 'single',
        childrenUnder18: '',
        childrenUnder5: '',
        singleParent: false,
        newImmigrant: false,
        immigrationYear: '',
        academicDegree: false,
        degreeType: '',
        completionYear: '',
        liveInPriorityArea: false,
        priorityAreaName: '',
        hasMedicalCondition: false,
        hasDisabledFamilyMember: false,
        paidChildcare: false,
        childcareAmount: '',
        paidParentCare: false,
        parentCareAmount: '',
        donationsAmount: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error.message || 'אירעה שגיאה בשליחת הטופס');
    }
  };

  const renderIncomeStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">פרטי הכנסה</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            הכנסה שנתית ברוטו
          </label>
          <input
            {...inputProps}
            type="number"
            name="annualIncome"
            value={formData.annualIncome}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            מספר חודשי עבודה
          </label>
          <input
            {...inputProps}
            type="number"
            name="monthsWorked"
            value={formData.monthsWorked}
            onChange={handleChange}
            min="1"
            max="12"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="has106"
            checked={formData.has106}
            onChange={handleChange}
            className="h-4 w-4 text-[#B78628] focus:ring-[#B78628] border-gray-300 rounded"
          />
          <label className="mr-2 block text-sm text-gray-700">
            יש ברשותי טופס 106
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="hasMultipleEmployers"
            checked={formData.hasMultipleEmployers}
            onChange={handleChange}
            className="h-4 w-4 text-[#B78628] focus:ring-[#B78628] border-gray-300 rounded"
          />
          <label className="mr-2 block text-sm text-gray-700">
            עבדתי אצל מספר מעסיקים במהלך השנה
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          הפרשות לפנסיה (שנתי)
        </label>
        <input
          {...inputProps}
          type="number"
          name="pensionContributions"
          value={formData.pensionContributions}
          onChange={handleChange}
        />
      </div>
    </div>
  );

  const renderPersonalStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">מצב אישי</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            סטטוס משפחתי
          </label>
          <select
            {...inputProps}
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleChange}
            required
          >
            <option value="single">רווק</option>
            <option value="married">נשוי</option>
            <option value="divorced">גרוש</option>
            <option value="widowed">אלמן</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            מספר ילדים מתחת לגיל 18
          </label>
          <input
            {...inputProps}
            type="number"
            name="childrenUnder18"
            value={formData.childrenUnder18}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderDeductionsStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">ניכויים וזיכויים</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            סכום תרומות (שנתי)
          </label>
          <input
            {...inputProps}
            type="number"
            name="donationsAmount"
            value={formData.donationsAmount}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            עלות טיפול בילדים
          </label>
          <input
            {...inputProps}
            type="number"
            name="childcareAmount"
            value={formData.childcareAmount}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );

  const renderContactStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">פרטי קשר</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">שם מלא</label>
          <input
            {...inputProps}
            type="text"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">אימייל</label>
          <input
            {...inputProps}
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">מספר טלפון</label>
        <input
          {...inputProps}
          type="tel"
          name="contactPhone"
          value={formData.contactPhone}
          onChange={handleChange}
          required
        />
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#2C3E50] mb-8">
          בדיקת זכאות להחזר מס
        </h2>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between relative">
            {/* Progress Line */}
            <div 
              className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200"
              style={{ zIndex: 0 }}
            />
            <div 
              className="absolute top-4 left-0 h-0.5 bg-[#B78628] transition-all duration-300"
              style={{
                width: `${(currentStep / (Object.keys(STEPS).length - 1)) * 100}%`,
                zIndex: 1,
              }}
            />

            {Object.values(STEPS).map((step) => (
              <div
                key={step}
                className={`w-1/4 text-center relative z-10 ${
                  currentStep >= step ? 'text-[#B78628]' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center border-2 bg-white ${
                    currentStep >= step
                      ? 'border-[#B78628] text-[#B78628]'
                      : 'border-gray-300'
                  }`}
                >
                  {step + 1}
                </div>
                <div className="mt-2 text-sm font-medium">
                  {step === STEPS.INCOME && 'הכנסה'}
                  {step === STEPS.PERSONAL && 'מצב אישי'}
                  {step === STEPS.DEDUCTIONS && 'זיכויים'}
                  {step === STEPS.CONTACT && 'פרטי קשר'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === STEPS.INCOME && renderIncomeStep()}
          {currentStep === STEPS.PERSONAL && renderPersonalStep()}
          {currentStep === STEPS.DEDUCTIONS && renderDeductionsStep()}
          {currentStep === STEPS.CONTACT && renderContactStep()}
          <div className="flex justify-between mt-8">
            {currentStep > STEPS.INCOME && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 border border-[#B78628] text-[#B78628] rounded-md hover:bg-gray-50 transition-colors"
              >
                חזור
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-[#B78628] text-white rounded-md hover:bg-[#96691E] transition-colors"
            >
              {currentStep === STEPS.CONTACT ? 'שלח' : 'המשך'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
