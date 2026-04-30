"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2, UserPlus } from "lucide-react";
import type { ApiError } from "@/types/domain";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Client-side check
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setIsLoading(true);
    try {
      // 2. Updated payload to match Django Serializer keys
      await api.post("/auth/registration/", {
        username: formData.username,
        email: formData.email,
        password1: formData.password,         // 🔑 Changed from password
        password2: formData.confirmPassword,  // 🔑 Changed from confirmPassword
      });

      toast.success("Account created! Please login.");
      router.push("/login");
    } catch (err: unknown) {
      const serverErrors = (err as ApiError).response?.data as Record<string, string[] | string> | undefined;
      if (serverErrors) {
        const fieldName = Object.keys(serverErrors)[0];
        const message = serverErrors[fieldName];
        toast.error(`${fieldName}: ${Array.isArray(message) ? message[0] : message}`);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1a1c23] border border-gray-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600/20 p-3 rounded-xl mb-4">
            <UserPlus className="h-8 w-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create an account</h1>
          <p className="text-gray-500 text-sm">Join Nexus and start managing tasks</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Username</label>
            <input
              type="text"
              required
              className="w-full bg-[#09090b] border border-gray-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              placeholder="johndoe"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full bg-[#09090b] border border-gray-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              placeholder="name@company.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                required
                className="w-full bg-[#09090b] border border-gray-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Confirm</label>
              <input
                type="password"
                required
                className="w-full bg-[#09090b] border border-gray-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-4 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}