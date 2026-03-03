import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, User, Settings, LogOut } from "lucide-react";

export default function AppHeader() {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navigate = useNavigate();

    const currentUser = {
        name: "John Anderson",
        role: "Admin",
        email: "john@capitalcoffee.com",
        avatar: "JA"
    };

    return (
        <header className="relative z-10 flex h-[72px] shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
            <div className="flex max-w-2xl flex-1 items-center gap-4">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search orders, inventory, franchises..."
                        className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm outline-none transition-colors focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button className="relative flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-gray-100">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-red-500"></span>
                </button>
                <div className="relative">
                    <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className={`flex items-center gap-3 rounded-lg border p-1 pr-1.5 transition-all ${
                            userMenuOpen ? "border-gray-300 bg-gray-50 shadow-sm" : "border-transparent hover:border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                        <div className="hidden pl-2 text-right md:block">
                            <p className="text-sm font-medium leading-tight text-gray-900">{currentUser.name}</p>
                            <p className="text-xs leading-tight text-gray-500">{currentUser.role}</p>
                        </div>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-600">
                            <span className="text-sm font-medium text-white">{currentUser.avatar}</span>
                        </div>
                    </button>
                    {userMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                            <div className="border-b border-gray-100 px-4 py-3">
                                <p className="font-medium text-gray-900">{currentUser.name}</p>
                                <p className="text-sm text-gray-500">{currentUser.email}</p>
                            </div>
                            <div className="py-1">
                                <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                                    <User className="h-4 w-4 text-gray-500" /> My Profile
                                </Link>
                                <Link to="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                                    <Settings className="h-4 w-4 text-gray-500" /> Settings
                                </Link>
                            </div>
                            <div className="mt-1 border-t border-gray-100 py-1">
                                <button onClick={() => navigate("/login")} className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    <LogOut className="h-4 w-4 text-gray-500" /> Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}