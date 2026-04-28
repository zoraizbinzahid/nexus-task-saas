"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"
import axios from "axios" // Added for error checking
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            // DEEP RESEARCH FIX: Based on your settings.py, dj-rest-auth 
            // usually lives at /dj-rest-auth/login/ or /api/auth/login/
            // Change this to match your backend urls.py
            await api.post("/auth/login/", { 
                username: email, // dj-rest-auth sometimes looks for 'username' even if it's an email
                email: email, 
                password: password 
            })

            // Cookie is now set! Send them home.
            router.push("/")
            router.refresh()
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                // Shows the actual error from Django (e.g. "Unable to log in with provided credentials")
                const msg = err.response?.data?.non_field_errors?.[0] || "Login failed."
                setError(msg)
            } else {
                setError("An unexpected error occurred.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0b0c10] p-4">
            <Card className="w-full max-w-md border-gray-800 bg-[#1a1c23] text-white shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">Nexus Login</CardTitle>
                    <CardDescription className="text-gray-400">
                        Secure Authentication Required
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <p className="text-xs text-red-500 bg-red-500/10 p-2 rounded border border-red-500/20">
                                {error}
                            </p>
                        )}
                        <Input
                            type="email"
                            placeholder="Admin Email"
                            className="bg-gray-900 border-gray-700 focus:border-blue-500 transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            className="bg-gray-900 border-gray-700 focus:border-blue-500 transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6"
                        >
                            {isLoading ? "Authenticating..." : "Unlock Workspace"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}