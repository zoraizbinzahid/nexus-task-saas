"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function RegisterPage() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        username: ""
    });
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const promise = api.post("/auth/registration/", form);

        toast.promise(promise, {
            loading: 'Creating your Nexus account...',
            success: () => {
                router.push("/login");
                return "Account created! Please log in.";
            },
            error: "Registration failed. Check if user already exists.",
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0b0c10] p-4">
            <Card className="w-full max-w-md border-gray-800 bg-[#1a1c23] text-white">
                <CardHeader><CardTitle className="text-center text-2xl">Create Account</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <Input placeholder="Username" onChange={e => setForm({...form, username: e.target.value})} className="bg-gray-900 border-gray-700" required />
                        <Input type="email" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} className="bg-gray-900 border-gray-700" required />
                        <Input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} className="bg-gray-900 border-gray-700" required />
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Join Nexus</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}


