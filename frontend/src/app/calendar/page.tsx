"use client"

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarPage() {
    // Basic calendar logic for "April 2026"
    const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

    return (
        <div className="p-8 text-white min-h-screen bg-[#0b0c10]">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">April 2026</h1>
                <div className="flex gap-2">
                    <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700"><ChevronLeft /></button>
                    <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700"><ChevronRight /></button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-800 border border-gray-800 rounded-xl overflow-hidden">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="bg-gray-900 p-4 text-center text-sm font-bold text-gray-500 uppercase">
                        {day}
                    </div>
                ))}
                {/* Empty cells for start of month would go here */}
                {daysInMonth.map(date => (
                    <div key={date} className="bg-[#1a1c23] min-h-[120px] p-2 hover:bg-[#21242d] transition-all cursor-pointer border-t border-r border-gray-800">
                        <span className="text-sm text-gray-500">{date}</span>
                        {/* Task items would be mapped here based on task.due_date */}
                        {date === 27 && (
                            <div className="mt-2 p-1 text-[10px] bg-blue-600 rounded-sm">Finish Nexus Sprint</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}