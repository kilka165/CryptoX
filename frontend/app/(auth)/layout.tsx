import { Footer } from "@/components/Footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="w-full max-w-md space-y-8">
        {children}
        <Footer />
      </div>
    </div>
  );
}
