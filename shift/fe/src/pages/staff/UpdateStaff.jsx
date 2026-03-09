import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UserPlus, Phone, MapPin, Calendar, Users, Mail } from "lucide-react";
import { getStaffById, updateStaff, updateStaffStatus } from "../../api/staffApi";

const BRANCHES = [
    { value: "BR-001", label: "Ho Chi Minh Branch (BR-001)" },
    { value: "BR-002", label: "Da Nang Branch (BR-002)"     },
    { value: "BR-003", label: "Hanoi Branch (BR-003)"       },
];

const STATUS_CFG = {
    ACTIVE: {
        label:       "Đang làm việc",
        badgeCls:    "bg-green-100 text-green-700 border-green-200",
        dot:         "bg-green-500",
        actionLabel: "Cho nghỉ việc",
        actionCls:   "bg-red-50 text-red-600 border-red-200 hover:bg-red-100",
        next:        "INACTIVE",
    },
    INACTIVE: {
        label:       "Nghỉ việc",
        badgeCls:    "bg-gray-100 text-gray-500 border-gray-200",
        dot:         "bg-gray-400",
        actionLabel: "Kích hoạt lại",
        actionCls:   "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
        next:        "ACTIVE",
    },
};

const inputCls    = "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-400 transition-all text-sm";
const disabledCls = "w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed text-sm";
const labelCls    = "block text-sm font-medium text-gray-700 mb-2";

export default function UpdateStaff() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form,           setForm]           = useState({ name: "", email: "", phone: "", branchId: "", dateOfBirth: "", gender: "MALE" });
    const [status,         setStatus]         = useState("ACTIVE");
    const [loading,        setLoading]        = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error,          setError]          = useState(null);
    const [confirmStatus,  setConfirmStatus]  = useState(false);
    const [statusLoading,  setStatusLoading]  = useState(false);

    useEffect(() => {
        getStaffById(id)
            .then(s => {
                setForm({
                    name:        s.name        || "",
                    email:       s.email       || "",
                    phone:       s.phone       || "",
                    branchId:    s.branchId    || "",
                    dateOfBirth: s.dateOfBirth || "",
                    gender:      s.gender      || "MALE",
                });
                setStatus(s.status ?? "ACTIVE");
            })
            .catch(() => setError("Không thể tải thông tin nhân viên."))
            .finally(() => setInitialLoading(false));
    }, [id]);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateStaff(id, form);
            navigate("/staff");
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        const cfg = STATUS_CFG[status] ?? STATUS_CFG.ACTIVE;
        setStatusLoading(true);
        try {
            await updateStaffStatus(id, cfg.next);
            setStatus(cfg.next);
        } catch (e) {
            alert("Lỗi: " + e.message);
        } finally {
            setStatusLoading(false);
            setConfirmStatus(false);
        }
    };

    if (initialLoading) return (
        <div className="p-10 text-center text-gray-400 text-sm">Đang tải…</div>
    );

    const cfg = STATUS_CFG[status] ?? STATUS_CFG.ACTIVE;

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <ArrowLeft size={20} className="text-gray-600"/>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Update Staff Info</h1>
                    <p className="text-sm text-gray-500">Chỉnh sửa thông tin: <b className="text-amber-600">{form.name}</b></p>
                </div>
            </div>

            {/* Status card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 flex items-center justify-between gap-4">
                <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Trạng thái nhân viên</div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${cfg.badgeCls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}/>
                        {cfg.label}
                    </span>
                </div>

                {confirmStatus ? (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                            Chuyển sang <b>{STATUS_CFG[cfg.next].label}</b>?
                        </span>
                        <button onClick={handleToggleStatus} disabled={statusLoading}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors disabled:opacity-50 ${cfg.actionCls}`}>
                            {statusLoading ? "…" : "Xác nhận"}
                        </button>
                        <button onClick={() => setConfirmStatus(false)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100">
                            Huỷ
                        </button>
                    </div>
                ) : (
                    <button onClick={() => setConfirmStatus(true)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${cfg.actionCls}`}>
                        {cfg.actionLabel}
                    </button>
                )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm font-medium">
                        ⚠ {error}
                    </div>
                )}

                {/* Name + Gender */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1">
                        <label className={labelCls}>Họ và tên <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <UserPlus className="absolute left-3 top-2.5 text-gray-400" size={17}/>
                            <input name="name" required value={form.name} onChange={handleChange} className={inputCls}/>
                        </div>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <label className={labelCls}>Giới tính <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Users className="absolute left-3 top-2.5 text-gray-400" size={17}/>
                            <select name="gender" required value={form.gender} onChange={handleChange}
                                className={`${inputCls} bg-white appearance-none`}>
                                <option value="MALE">Nam</option>
                                <option value="FEMALE">Nữ</option>
                                <option value="OTHER">Khác</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Email (disabled) + Phone */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1">
                        <label className={labelCls}>Email <span className="text-xs text-gray-400 font-normal">(không thể đổi)</span></label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 text-gray-400" size={17}/>
                            <input value={form.email} disabled className={disabledCls}/>
                        </div>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <label className={labelCls}>Số điện thoại <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-2.5 text-gray-400" size={17}/>
                            <input name="phone" required value={form.phone} onChange={handleChange}
                                className={inputCls} maxLength={10}
                                onInput={e => e.target.value = e.target.value.replace(/\D/g, "")}/>
                        </div>
                    </div>
                </div>

                {/* DOB + Branch */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1">
                        <label className={labelCls}>Ngày sinh <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 text-gray-400" size={17}/>
                            <input name="dateOfBirth" type="date" required
                                value={form.dateOfBirth} onChange={handleChange} className={inputCls}/>
                        </div>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <label className={labelCls}>Chi nhánh</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 text-gray-400" size={17}/>
                            <select name="branchId" value={form.branchId} onChange={handleChange}
                                className={`${inputCls} bg-white appearance-none`}>
                                {BRANCHES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                    <button type="button" onClick={() => navigate(-1)}
                        className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Huỷ
                    </button>
                    <button type="submit" disabled={loading}
                        className="px-5 py-2.5 text-sm font-bold bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors">
                        {loading ? "Đang lưu…" : "Lưu thay đổi"}
                    </button>
                </div>
            </form>
        </div>
    );
}