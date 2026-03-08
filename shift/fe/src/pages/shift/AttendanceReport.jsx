import React, { useEffect, useState } from "react";
import { BarChart3, Clock, RefreshCw, Award, TrendingDown } from "lucide-react";
import { getAttendanceReport } from "../../api/attendanceApi";

export default function AttendanceReport() {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadReport = async () => {
        setLoading(true);
        try {
            // Frontend bây giờ cực kỳ thảnh thơi, chỉ việc gọi 1 API duy nhất
            const data = await getAttendanceReport();
            setReportData(data || []);
        } catch (error) {
            console.error("Lỗi khi tải báo cáo:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReport();
    }, []);

    // Hàm tô màu cho thanh Coverage
    const getCoverageColor = (pct) => {
        if (pct >= 95) return "bg-emerald-500";
        if (pct >= 80) return "bg-blue-500";
        if (pct >= 50) return "bg-amber-500";
        return "bg-rose-500";
    };

    const getCoverageText = (pct) => {
        if (pct >= 95) return "text-emerald-600";
        if (pct >= 80) return "text-blue-600";
        if (pct >= 50) return "text-amber-600";
        return "text-rose-600";
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
                <RefreshCw size={40} className="animate-spin text-amber-500" />
                <p className="text-gray-500 font-medium">Đang tải báo cáo từ máy chủ...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="text-amber-500" /> Attendance Coverage
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Báo cáo tỷ lệ chuyên cần (Tính chính xác theo số phút phân công và số phút đi trễ/về sớm/vắng mặt).
                    </p>
                </div>
                <button onClick={loadReport} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                    <RefreshCw size={16} /> Làm mới
                </button>
            </div>

            {/* BẢNG BÁO CÁO TỔNG HỢP */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nhân viên</th>
                            <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Ca (Bắt đầu/Kết thúc)</th>
                            <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Đã làm / Vắng</th>
                            <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Trễ / Về sớm</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[250px]">Coverage % (Working Mins)</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {reportData.map((staff, index) => (
                            <tr key={staff.staffId} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0">
                                            {staff.staffName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                                {staff.staffName}
                                                {index === 0 && staff.assignedShifts > 0 && <Award size={14} className="text-amber-500" title="Nhân viên xuất sắc" />}
                                            </p>
                                            <p className="text-xs text-gray-500 font-medium bg-gray-100 px-1.5 py-0.5 rounded w-max mt-0.5">{staff.staffCode}</p>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-4 py-4 text-center">
                                        <span className="font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
                                            {staff.assignedShifts} ca
                                        </span>
                                </td>

                                <td className="px-4 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2 text-sm font-bold">
                                        <span className="text-emerald-600" title="Có mặt">{staff.presentCount}</span>
                                        <span className="text-gray-300">/</span>
                                        <span className="text-rose-500" title="Vắng mặt">{staff.absentCount}</span>
                                    </div>
                                </td>

                                <td className="px-4 py-4 text-center">
                                    {(staff.totalLateMins > 0 || staff.totalEarlyMins > 0) ? (
                                        <div className="flex flex-col items-center justify-center gap-1 text-xs font-bold text-amber-600">
                                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded">
                                                <Clock size={12} /> Trễ {staff.totalLateMins}p
                                            </div>
                                            <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                                                <Clock size={12} /> Sớm {staff.totalEarlyMins}p
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-bold text-gray-400">—</span>
                                    )}
                                </td>

                                <td className="px-6 py-4">
                                    {staff.assignedShifts === 0 ? (
                                        <span className="text-xs font-medium text-gray-400 italic">Chưa phát sinh dữ liệu</span>
                                    ) : (
                                        <div className="w-full">
                                            <div className="flex justify-between items-end mb-1">
                                                    <span className={`text-sm font-black ${getCoverageText(staff.coveragePercentage)}`}>
                                                        {staff.coveragePercentage}%
                                                    </span>
                                                {staff.coveragePercentage < 70 && <TrendingDown size={14} className="text-rose-500 mb-0.5" />}
                                            </div>
                                            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${getCoverageColor(staff.coveragePercentage)}`}
                                                    style={{ width: `${staff.coveragePercentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}