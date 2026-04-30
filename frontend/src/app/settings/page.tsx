"use client"

import { useState } from "react"
import api from "@/lib/axios"
import { toast } from "sonner"
import { Trash2, Key } from "lucide-react"

export default function SettingsPage() {
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    const [deletePassword, setDeletePassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!oldPassword || !newPassword || !confirmNewPassword) return toast.error("Please fill all password fields")
        if (newPassword !== confirmNewPassword) return toast.error("New passwords do not match")
        
        setIsLoading(true)
        try {
            await api.post("/auth/password/change/", { 
                old_password: oldPassword, 
                new_password1: newPassword,
                new_password2: confirmNewPassword
            })
            toast.success("Security updated successfully!")
            setOldPassword("")
            setNewPassword("")
            setConfirmNewPassword("")
        } catch (err) {
            toast.error("Failed to update password.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteAccount = async () => {
        if (!deletePassword) {
            toast.error("Current password is required to delete account.")
            return
        }
        if (window.confirm("Are you sure? This is permanent.")) {
            try {
                await api.post("/auth/account/delete/", { current_password: deletePassword })
                window.location.href = "/register"
            } catch (err) {
                toast.error("Delete failed.")
            }
        }
    }

    return (
        <div className="p-8 text-white bg-[#0b0c10] min-h-screen font-sans">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            <div className="max-w-3xl space-y-6">
                
                {/* PASSWORD FORM */}
                <div className="bg-[#1a1c23] p-6 rounded-2xl border border-gray-800">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-yellow-600/10 rounded-lg text-yellow-500">
                            <Key className="h-6 w-6" />
                        </div>
                        <h2 className="text-lg font-semibold">Security</h2>
                    </div>
                    
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <input 
                            type="password"
                            placeholder="Current Password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full bg-[#0b0c10] border border-gray-800 p-3 rounded-lg outline-none focus:border-blue-500 transition-all"
                        />
                        <input 
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-[#0b0c10] border border-gray-800 p-3 rounded-lg outline-none focus:border-blue-500 transition-all"
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className="w-full bg-[#0b0c10] border border-gray-800 p-3 rounded-lg outline-none focus:border-blue-500 transition-all"
                        />
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50"
                        >
                            {isLoading ? "Syncing..." : "Update Password"}
                        </button>
                    </form>
                </div>

                {/* DANGER ZONE */}
                <div className="bg-red-500/5 p-6 rounded-2xl border border-red-500/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-500/10 rounded-lg text-red-500">
                                <Trash2 className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-red-500">Account</h2>
                                <p className="text-sm text-gray-500">Delete all your data forever</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleDeleteAccount}
                            className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg transition-all font-semibold"
                        >
                            Delete
                        </button>
                    </div>
                    <input
                        type="password"
                        placeholder="Enter current password to confirm delete"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        className="mt-4 w-full bg-[#0b0c10] border border-red-500/30 p-3 rounded-lg outline-none focus:border-red-500 transition-all"
                    />
                </div>
            </div>
        </div>
    )
}