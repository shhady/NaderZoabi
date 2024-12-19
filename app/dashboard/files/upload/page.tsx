"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import FileUpload from '@/components/FileUpload';

export default function FileUploadPage() {
  const { user } = useUser();
  const [uploadedFor, setUploadedFor] = useState("");

  if (user?.publicMetadata?.role !== "admin") {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-red-600">אין גישה</h2>
        <p className="text-gray-600 mt-2">
          אין לך הרשאות לצפות בדף זה
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#2C3E50]">העלאת קבצים</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              העלה עבור (מזהה לקוח)
            </label>
            <input
              type="text"
              value={uploadedFor}
              onChange={(e) => setUploadedFor(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#B78628]"
              placeholder="השאר ריק להעלאה עבור עצמך"
            />
          </div>

          <FileUpload uploadedFor={uploadedFor} />
        </div>
      </div>
    </div>
  );
}
