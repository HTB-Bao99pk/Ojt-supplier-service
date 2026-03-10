import { useEffect, useState } from "react";
import { getAllStaffs } from "../api/staffApi";
import { getSchedulesByStaff } from "../api/staffScheduleApi";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, CheckCircle, XCircle } from "lucide-react";

function StatCard({ icon, label, value, bg }) {
  return (
    <div className="flex-1 min-w-[160px] p-4 rounded-lg" style={{ background: bg }}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-white/30">
          {icon}
        </div>
        <div>
          <div className="text-sm text-gray-500">{label}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = (status || "").toString();
  // treat backend CANCELED as ABSENT for display
  if (s === "COMPLETED" || s === "PRESENT") {
    return (<span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">COMPLETED</span>);
  }
  if (s === "IN_PROGRESS") {
    return (<span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">IN_PROGRESS</span>);
  }
  if (s === "ABSENT" || s === "CANCELED") {
    return (<span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">ABSENT</span>);
  }
  // default SCHEDULED
  return (<span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">SCHEDULED</span>);
}

// shortens shift UUID to SH-XXXXX for display
const formatShiftId = (id) => {
  if (!id) return "—";
  try {
    return `SH-${String(id).substring(0,5).toUpperCase()}`;
  } catch (e) { return id; }
};

export default function StaffSchedules() {
   const [staffs, setStaffs] = useState([]);
   const [selectedStaff, setSelectedStaff] = useState(null);
   const [schedules, setSchedules] = useState([]);
   const [loadingStaffs, setLoadingStaffs] = useState(true);
   const [loadingSchedules, setLoadingSchedules] = useState(false);
   const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoadingStaffs(true);
      try {
        const data = await getAllStaffs(0, 100);
        const list = data?.content || (Array.isArray(data) ? data : []);
        setStaffs(list);
      } catch (e) {
        console.error(e);
        setStaffs([]);
      } finally {
        setLoadingStaffs(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedStaff) return;
    (async () => {
      setLoadingSchedules(true);
      try {
        const data = await getSchedulesByStaff(selectedStaff.id);
        setSchedules(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setSchedules([]);
      } finally {
        setLoadingSchedules(false);
      }
    })();
  }, [selectedStaff]);

  // computed stats
  const total = schedules.length;
  const completed = schedules.filter(s => (s.status === "COMPLETED" || s.status === "PRESENT")).length;
  const absent = schedules.filter(s => (s.status === "ABSENT" || s.status === "CANCELED")).length;
  const scheduled = schedules.filter(s => s.status === "SCHEDULED").length;

  const filteredStaffs = staffs.filter(s => s.name?.toLowerCase().includes(query.toLowerCase()) || s.staffCode?.toLowerCase().includes(query.toLowerCase()));

  const formatTime = (t) => {
    if (!t) return "-";
    return t?.substring?.(0,5) || t;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Staff Schedules</h1>
      </div>

      {/* top area: selector + stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1">
          <div className="rounded-xl shadow-sm bg-white p-4">
            <label className="block text-sm font-semibold text-gray-500 mb-3">Select Staff Member</label>
            <div className="flex items-center gap-2 border rounded-lg p-2">
              <Search className="text-gray-400" />
              <input
                className="flex-1 outline-none text-sm"
                placeholder="Search by name or code"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="mt-3 max-h-60 overflow-y-auto">
              {loadingStaffs && <div className="text-sm text-gray-500">Loading staff list…</div>}
              {!loadingStaffs && filteredStaffs.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStaff(s)}
                  className={`w-full text-left px-3 py-2 rounded-md my-1 ${selectedStaff?.id === s.id ? 'bg-sky-50 border border-sky-200' : 'hover:bg-gray-50'}`}
                >
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-xs text-gray-400">{s.staffCode || s.id}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-xl shadow-sm bg-white p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="text-sm text-gray-500">{selectedStaff ? `Showing schedules for` : 'Please select a staff'}</div>
                <div className="text-lg font-bold">{selectedStaff ? selectedStaff.name : ''}</div>
              </div>
              <div className="flex gap-3 w-full sm:w-auto flex-wrap">
                <StatCard icon={<Calendar className="text-sky-600"/>} label="Total Shifts" value={total} bg="#f0f9ff" />
                <StatCard icon={<CheckCircle className="text-green-600"/>} label="Completed" value={completed} bg="#ecfdf5" />
                <StatCard icon={<Calendar className="text-gray-600"/>} label="Scheduled" value={scheduled} bg="#f8fafc" />
                <StatCard icon={<XCircle className="text-red-600"/>} label="Absent" value={absent} bg="#fff1f2" />
              </div>
            </div>

            {/* table container */}
            <div className="mt-6 overflow-auto rounded-lg border border-gray-100">
              {loadingSchedules && <div className="p-6 text-center text-gray-500">Loading schedules…</div>}

              {!loadingSchedules && !selectedStaff && (
                <div className="p-6 text-center text-gray-400">Please select a staff to view schedules.</div>
              )}

              {!loadingSchedules && selectedStaff && schedules.length === 0 && (
                <div className="p-6 text-center text-gray-400">No schedules assigned.</div>
              )}

              {!loadingSchedules && schedules.length > 0 && (
                <table className="w-full min-w-[800px] table-auto">
                  <thead className="bg-white border-b sticky top-0">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs text-gray-500">Date</th>
                      <th className="text-left px-4 py-3 text-xs text-gray-500">Shift ID</th>
                      <th className="text-left px-4 py-3 text-xs text-gray-500">Start</th>
                      <th className="text-left px-4 py-3 text-xs text-gray-500">End</th>
                      <th className="text-left px-4 py-3 text-xs text-gray-500">Branch</th>
                      <th className="text-left px-4 py-3 text-xs text-gray-500">Status</th>
                      <th className="text-right px-4 py-3 text-xs text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((s, idx) => (
                      <tr key={s.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-amber-50/30`}>
                        <td className="px-4 py-3 text-sm text-gray-700">{s.date}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{formatShiftId(s.shiftId)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{formatTime(s.startTime)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{formatTime(s.endTime)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{s.branchId || s.branch}</td>
                        <td className="px-4 py-3 text-sm"> <StatusBadge status={s.status} /> </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate('/attendance?shiftId=' + encodeURIComponent(s.shiftId) + '&date=' + encodeURIComponent(s.date))}
                              className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border hover:bg-gray-50 text-sm"
                              aria-label={`Open attendance for ${s.shiftId}`}
                            >
                              <Calendar size={16} /> Attendance
                            </button>
                          </div>
                        </td>
                      </tr>
                     ))}
                   </tbody>
                 </table>
               )}
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 }
