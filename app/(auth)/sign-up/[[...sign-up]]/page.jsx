import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <SignUp 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-[#B78628] hover:bg-[#96691E]',
            footerActionLink: 'text-[#B78628] hover:text-[#96691E]'
          }
        }}
        afterSignUpUrl="/dashboard"
        redirectUrl="/dashboard"
      />
    </div>
  );
}