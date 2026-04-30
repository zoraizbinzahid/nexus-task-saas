"use client"

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  const publicPages = ["/login", "/register"];
  const isPublicPage = publicPages.includes(pathname);

  useEffect(() => {
    api.get("/auth/user/")
      .then(() => {
        setStatus("authenticated");
        // If they are logged in but on the login page, kick them to home
        if (isPublicPage) router.push("/");
      })
      .catch(() => {
        setStatus("unauthenticated");
        // If they aren't logged in and aren't on a public page, kick them to login
        if (!isPublicPage) router.push("/login");
      });
  }, [pathname, isPublicPage, router]);

  // 1. While checking the session, show a clean loading screen
  if (status === "loading") {
    return (
      <div className="h-screen w-full bg-[#09090b] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="text-gray-500 font-mono text-xs uppercase tracking-widest text-center">
          Securing Nexus Session...
        </p>
      </div>
    );
  }

  // 2. If unauthorized and trying to access dashboard, return nothing (Redirect handles it)
  if (status === "unauthenticated" && !isPublicPage) {
    return null; 
  }

  // 3. If authenticated OR on a public page, show the content
  return <>{children}</>;
}