import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, Mail, Phone, MapPin, Calendar, Users } from "lucide-react";
import { createStaff } from "../../api/staffApi";

const CURRENT_BRANCH_ID = "BR-001";

const BRANCHES = [
    { value: "BR-001", label: "Ho Chi Minh Branch (BR-001)" },
    { value: "BR-002", label: "Da Nang Branch (BR-002)"     },
    { value: "BR-003", label: "Hanoi Branch (BR-003)"       },
];

/* max date = 18 năm trước hôm nay */
const maxDob = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().slice(0, 10);
};

export default function CreateStaff() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState(null);

    const [form, setForm] = useState({
        name:        "",
        email:       "",
        phone:       "",
        branchId:    CURRENT_BRANCH_ID,
        dateOfBirth: "",
        gender:      "MALE",
    });

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await createStaff(form);
            navigate("/staff");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const inputCls = "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-400 transition-all text-sm";
    const labelCls = "block text-sm font-medium text-gray-700 mb-2";

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <ArrowLeft size={20} className="text-gray-600"/>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Staff</h1>
                    <p className="text-sm text-gray-500">Thêm nhân viên mới vào chi nhánh của bạn.</p>
                </div>
            </div>

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
                            <input name="name" required value={form.name} onChange={handleChange}
                                className={inputCls} placeholder="Nguyen Van A"/>
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

                {/* Email + Phone */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1">
                        <label className={labelCls}>Email <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 text-gray-400" size={17}/>
                            <input name="email" type="email" required value={form.email} onChange={handleChange}
                                className={inputCls} placeholder="abc@gmail.com"/>
                        </div>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <label className={labelCls}>Số điện thoại <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-2.5 text-gray-400" size={17}/>
                            <input name="phone" required value={form.phone} onChange={handleChange}
                                className={inputCls} placeholder="09xxxxxxxx" maxLength={10}
                                onInput={e => e.target.value = e.target.value.replace(/\D/g, "")}/>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Định dạng: 03/05/07/08/09xxxxxxxx</p>
                    </div>
                </div>

                {/* DOB + Branch */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1">
                        <label className={labelCls}>Ngày sinh <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 text-gray-400" size={17}/>
                            <input name="dateOfBirth" type="date" required
                                value={form.dateOfBirth} onChange={handleChange}
                                max={maxDob()}
                                className={inputCls}/>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Phải đủ 18 tuổi trở lên</p>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <label className={labelCls}>Chi nhánh</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 text-gray-400" size={17}/>
                            <select name="branchId" value={CURRENT_BRANCH_ID} disabled
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg appearance-none bg-gray-100 text-gray-500 cursor-not-allowed font-medium text-sm">
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
                        {loading ? "Đang lưu…" : "Tạo nhân viên"}
                    </button>
                </div>
            </form>
        </div>
    );
}