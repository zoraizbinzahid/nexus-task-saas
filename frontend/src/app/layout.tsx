"use client"

import { Inter, Geist } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import Sidebar from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/sonner";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import AuthGuard from "@/components/layout/auth-guard"; // Import the bouncer
import "./globals.css";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={cn(inter.className, "bg-[#09090b] text-white")}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          
          {/* 🛡️ ALL logic goes inside the AuthGuard now */}
          <AuthGuard>
            {isAuthPage ? (
              <main>{children}</main>
            ) : (
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Navbar />
                  <main className="flex-1 overflow-y-auto p-6">
                    {children}
                  </main>
                </div>
              </div>
            )}
          </AuthGuard>

          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}