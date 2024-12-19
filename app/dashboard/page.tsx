import { currentUser } from '@clerk/nextjs/server';
import { getUserFiles } from '../lib/files';
import { FileDocument } from '../lib/types';

export default async function DashboardPage() {
  const user = await currentUser();
  const files = await getUserFiles(user?.id as string);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">
          Recent Files
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {files.map((file: FileDocument) => (
                <tr key={file._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {file.fileName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={file.fileUrl}
                      className="text-[#B78628] hover:text-[#96691E]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 