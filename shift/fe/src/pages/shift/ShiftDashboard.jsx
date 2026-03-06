import React from 'react';
import {
    Users, CalendarCheck, Clock, AlertCircle, Building2, TrendingUp,
    Percent, UserCheck, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CURRENT_BRANCH_ID = "BR-001";
const CURRENT_BRANCH_NAME = "Ho Chi Minh Central";

export default function ShiftDashboard() {
    const navigate = useNavigate();

    // 1. MOCK DATA: Tầng 1 - KPI Tổng quan
    const kpiStats = [
        { title: "Total Shifts", value: "8", icon: <CalendarCheck size={24} className="text-blue-600" />, bg: "bg-blue-50", text: "text-blue-700" },
        { title: "Staff on Duty", value: "15", icon: <UserCheck size={24} className="text-emerald-600" />, bg: "bg-emerald-50", text: "text-emerald-700" },
        { title: "Coverage Rate", value: "85%", icon: <Percent size={24} className="text-indigo-600" />, bg: "bg-indigo-50", text: "text-indigo-700" },
        { title: "Pending Check-ins", value: "3", icon: <Clock size={24} className="text-amber-600" />, bg: "bg-amber-50", text: "text-amber-700" },
        { title: "Late Staff", value: "2", icon: <AlertTriangle size={24} className="text-red-600" />, bg: "bg-red-50", text: "text-red-700" },
    ];

    // 2. MOCK DATA: Tầng 2 - Timeline ca làm việc
    const timelineData = [
        {
            id: 1,
            shiftName: "Morning Shift",
            time: "08:00 - 12:00",
            currentStaff: 5,
            requiredStaff: 5,
            status: "FULL", // FULL, MISSING
        },
        {
            id: 2,
            shiftName: "Afternoon Shift",
            time: "13:00 - 17:00",
            currentStaff: 3,
            requiredStaff: 5,
            status: "MISSING",
        },
        {
            id: 3,
            shiftName: "Evening Shift",
            time: "18:00 - 22:30",
            currentStaff: 4,
            requiredStaff: 4,
            status: "FULL",
        }
    ];

    return (
        <div className="space-y-8">
            {/* WELCOME BANNER CHO FRANCHISE OWNER */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            Dashboard <span className="text-slate-400 text-xl font-medium">| Franchise Manager</span>
                        </h1>
                        <p className="text-slate-300 flex items-center gap-2">
                            <Building2 size={16} className="text-amber-500"/>
                            Current Branch: <strong className="text-white bg-slate-700/50 px-3 py-1 rounded text-sm tracking-wide">{CURRENT_BRANCH_NAME} ({CURRENT_BRANCH_ID})</strong>
                        </p>
                    </div>
                    <div>
                        <button onClick={() => navigate('/shifts/create')} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-6 py-3 rounded-lg transition-all shadow-md flex items-center gap-2">
                            <CalendarCheck size={20}/>
                            Plan New Shift
                        </button>
                    </div>
                </div>
                <TrendingUp size={160} className="absolute -right-10 -bottom-10 text-white opacity-5" />
            </div>

            {/* TẦNG 1: KPI TỔNG QUAN (5 CỘT) */}
            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-blue-600"/> Today's Overview
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {kpiStats.map((stat, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center hover:shadow-md transition-shadow">
                            <div className={`p-3 rounded-full mb-3 ${stat.bg}`}>
                                {stat.icon}
                            </div>
                            <h3 className={`text-2xl font-extrabold ${stat.text}`}>{stat.value}</h3>
                            <p className="text-xs font-semibold text-gray-500 uppercase mt-1 tracking-wider">{stat.title}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* TẦNG 2: TIMELINE CA LÀM VIỆC */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Clock size={20} className="text-amber-500"/> Interactive Shift Timeline
                </h2>

                <div className="relative border-l-2 border-gray-100 ml-3 md:ml-6 space-y-8">
                    {timelineData.map((shift) => (
                        <div key={shift.id} className="relative pl-6 md:pl-10">
                            {/* Dấu chấm tròn trên trục thời gian */}
                            <span className={`absolute -left-[9px] top-4 w-4 h-4 rounded-full ring-4 ring-white ${shift.status === 'FULL' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>

                            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                                {/* Cột giờ (Trái) */}
                                <div className="w-40 shrink-0">
                                    <span className="text-lg font-bold text-slate-800 tracking-tight">{shift.time}</span>
                                    <p className="text-sm font-medium text-gray-500">{shift.shiftName}</p>
                                </div>

                                {/* Thẻ thông tin ca (Phải) */}
                                <div className={`flex-1 flex justify-between items-center p-4 rounded-xl border ${shift.status === 'FULL' ? 'bg-emerald-50/30 border-emerald-100' : 'bg-amber-50/30 border-amber-100'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-lg ${shift.status === 'FULL' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{CURRENT_BRANCH_NAME}</p>
                                            <p className="text-sm text-gray-600 mt-0.5">
                                                Staff assigned: <strong className={shift.status === 'FULL' ? 'text-emerald-700' : 'text-amber-700'}>{shift.currentStaff} / {shift.requiredStaff}</strong>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Trạng thái Full / Missing */}
                                    <div className="text-right">
                                        {shift.status === 'FULL' ? (
                                            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-full text-sm font-bold">
                                                <CheckCircle2 size={16} /> Full
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-amber-600 bg-amber-100 px-3 py-1.5 rounded-full text-sm font-bold">
                                                <AlertCircle size={16} /> Missing {shift.requiredStaff - shift.currentStaff}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}