"use client"

import React, { useEffect, useState, useMemo } from "react";
import api from "@/lib/axios";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday
} from "date-fns";
import type { ApiError, Task } from "@/types/domain";

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setIsLoading(true);
        const res = await api.get<Task[]>("/tasks/");
        setTasks(res.data);
      } catch (err: unknown) {
        const error = err as ApiError;
        if (error.response?.status !== 401) {
          console.error("Infrastructure Error: Calendar fetch failed.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchCalendarData();
  }, []);

  const calendarDays: Date[] = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2563eb]" />
      </div>
    );
  }

  return (
    <div className="p-8 text-white min-h-screen bg-[#09090b]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-2 text-blue-500 mb-1">
            <CalendarIcon size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Calendar</span>
          </div>
          <h1 className="text-3xl font-bold">{format(currentMonth, "MMMM yyyy")}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-[#1a1c23] border border-[#1f2937] rounded-xl p-1">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => setCurrentMonth(new Date())} className="px-4 text-xs font-bold uppercase tracking-wider hover:text-blue-500 transition-colors">
              Today
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-[#1f2937] border border-[#1f2937] rounded-2xl overflow-hidden shadow-2xl">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName: string) => (
          <div key={dayName} className="bg-gray-900 p-4 text-center text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
            {dayName}
          </div>
        ))}

        {/* ✅ Fix for 'day' and 'idx' red lines */}
        {calendarDays.map((day: Date) => {
          const dayTasks = tasks.filter((t: Task) => t.deadline && isSameDay(new Date(t.deadline), day));
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isTodayDate = isToday(day);

          return (
            <div 
              key={day.toISOString()} 
              className={`min-h-[140px] p-3 transition-all relative group ${isCurrentMonth ? "bg-[#1a1c23]" : "bg-[#1a1c23] opacity-30"} ${isTodayDate ? "ring-1 ring-inset ring-[#2563eb]" : ""} hover:bg-[#21242d] cursor-pointer`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-sm font-mono font-bold ${isTodayDate ? "text-[#2563eb] underline underline-offset-4" : "text-gray-500"}`}>
                  {format(day, "d")}
                </span>
              </div>
              
              <div className="space-y-1.5">
                {dayTasks.map((t: Task) => (
                  <div key={t.id} className="bg-blue-600/10 text-blue-400 border border-blue-500/20 text-[10px] px-2 py-1 rounded truncate font-medium">
                    {t.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}