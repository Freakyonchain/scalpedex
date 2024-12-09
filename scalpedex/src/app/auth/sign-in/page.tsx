// src/app/(auth)/sign-in/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-violet-400 to-purple-600 bg-clip-text text-transparent">
          ScalpedEx
        </h1>
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: "bg-violet-600 hover:bg-violet-700",
              card: "bg-violet-900/20 backdrop-blur-sm border border-violet-800/50",
              headerTitle: "text-white",
              headerSubtitle: "text-violet-300",
              formFieldInput: "bg-black/20 border-violet-800/50 text-white",
              formFieldLabel: "text-violet-300",
              footerActionText: "text-violet-300",
              footerActionLink: "text-violet-400 hover:text-violet-300"
            }
          }}
        />
      </div>
    </div>
  );
}