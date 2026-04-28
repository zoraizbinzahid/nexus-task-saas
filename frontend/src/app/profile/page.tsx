"use client"

import { useEffect, useState } from "react";
import api from "@/lib/axios";

// 1. Define the User interface to replace 'any'
interface User {
    pk: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
}

export default function ProfilePage() {
    // 2. Set the state to use the User interface or null
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        // 3. Tell axios what type of data to expect
        api.get<User>("/auth/user/")
            .then(res => {
                setUser(res.data);
            })
            .catch(() => {
                setError(true);
            });
    }, []);

    if (error) {
        return (
            <div className="h-screen bg-[#0b0c10] flex items-center justify-center text-red-500">
                Failed to load profile. Please log in again.
            </div>
        );
    }

    if (!user) {
        return (
            <div className="h-screen bg-[#0b0c10] flex items-center justify-center text-white">
                Authenticating...
            </div>
        );
    }

    return (
        <div className="p-8 text-white bg-[#0b0c10] min-h-screen">
            <div className="max-w-2xl mx-auto bg-[#1a1c23] p-8 rounded-2xl border border-gray-800">
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold uppercase">
                        {/* TypeScript now knows username is a string! */}
                        {user.username.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{user.username}</h1>
                        <p className="text-gray-400">{user.email}</p>
                    </div>
                </div>
                <hr className="border-gray-800 my-6" />
                
                <div className="space-y-4 mb-8">
                    <div className="flex justify-between py-2 border-b border-gray-800/50">
                        <span className="text-gray-500">Account ID</span>
                        <span className="font-mono text-blue-400">#00{user.pk}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-800/50">
                        <span className="text-gray-500">Email Status</span>
                        <span className="text-green-500 text-sm bg-green-500/10 px-2 py-0.5 rounded">Verified</span>
                    </div>
                </div>

                <button 
                    onClick={() => {
                        // We will add real logout logic here next
                        window.location.href = "/login";
                    }}
                    className="w-full bg-red-500/10 text-red-500 px-4 py-3 rounded-lg border border-red-500/20 hover:bg-red-500 hover:text-white transition-all font-semibold"
                >
                    Logout from Nexus
                </button>
            </div>
        </div>
    );
}