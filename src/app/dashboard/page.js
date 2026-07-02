"use client";

import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import Spinner from "../../components/common/Spinner";
import { apiFetch } from "../../lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { 
    Users, Car, Calendar, DollarSign, 
    Trash2, ShieldAlert, ShieldCheck, 
    Clock, ArrowRight, Activity, 
    PlusCircle, Plus, LayoutDashboard,
    UserCheck, UserX, ToggleLeft, ToggleRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState("overview");

    // Admin state
    const [adminStats, setAdminStats] = useState(null);
    const [allCars, setAllCars] = useState([]);
    const [allBookings, setAllBookings] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    
    // User state
    const [userStats, setUserStats] = useState(null);

    const [dataLoading, setDataLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const isAdmin = user && (user.role === "admin" || user.email === "mdnuraalamcse13@gmail.com");

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    // Fetch data based on role
    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            setDataLoading(true);
            try {
                if (isAdmin) {
                    // Fetch all admin data
                    const [statsData, carsData, bookingsData, usersData] = await Promise.all([
                        apiFetch("/api/admin/stats"),
                        apiFetch("/api/cars"),
                        apiFetch("/api/admin/bookings"),
                        apiFetch("/api/admin/users")
                    ]);
                    setAdminStats(statsData);
                    setAllCars(carsData);
                    setAllBookings(bookingsData);
                    setAllUsers(usersData);
                } else {
                    // Fetch normal user dashboard data
                    const statsData = await apiFetch("/api/users/dashboard-stats");
                    setUserStats(statsData);
                }
            } catch (err) {
                console.error("Dashboard fetch error:", err);
                toast.error("Failed to load dashboard statistics.");
            } finally {
                setDataLoading(false);
            }
        };

        fetchData();
    }, [user, isAdmin]);

    if (authLoading || dataLoading || !user) {
        return <Spinner fullPage />;
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateStr).toLocaleDateString(undefined, options);
    };

    // ================= ADMIN ACTIONS =================

    const handleToggleRole = async (userId, currentRole) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        const confirmed = window.confirm(`Are you sure you want to change this user's role to ${newRole}?`);
        if (!confirmed) return;

        setActionLoadingId(userId);
        try {
            await apiFetch(`/api/admin/users/${userId}/role`, {
                method: "PUT",
                body: { role: newRole }
            });
            toast.success(`Role updated to ${newRole} successfully!`);
            
            // Refresh list
            setAllUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
        } catch (err) {
            toast.error(err.message || "Failed to update role.");
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleDeleteUser = async (userId, userEmail, userName) => {
        if (userEmail === "mdnuraalamcse13@gmail.com") {
            toast.error("Cannot delete main administrator!");
            return;
        }
        if (userEmail === user.email) {
            toast.error("Cannot delete your own active administrator account!");
            return;
        }

        const confirmed = window.confirm(`Delete user "${userName}" and all associated records? This cannot be undone.`);
        if (!confirmed) return;

        setActionLoadingId(userId);
        try {
            await apiFetch(`/api/admin/users/${userId}`, { method: "DELETE" });
            toast.success("User deleted successfully.");
            setAllUsers(prev => prev.filter(u => u._id !== userId));
            
            // Update counts in stats
            setAdminStats(prev => prev ? { ...prev, totalUsers: Math.max(0, prev.totalUsers - 1) } : null);
        } catch (err) {
            toast.error(err.message || "Failed to delete user.");
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleAdminCancelBooking = async (bookingId, carName, userName) => {
        const confirmed = window.confirm(`Cancel booking for "${carName}" booked by ${userName}?`);
        if (!confirmed) return;

        setActionLoadingId(bookingId);
        try {
            await apiFetch(`/api/admin/bookings/${bookingId}`, { method: "DELETE" });
            toast.success("Booking cancelled successfully.");
            setAllBookings(prev => prev.filter(b => b._id !== bookingId));
            
            // Update stats
            setAdminStats(prev => prev ? { ...prev, totalBookings: Math.max(0, prev.totalBookings - 1) } : null);
        } catch (err) {
            toast.error(err.message || "Failed to cancel booking.");
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleAdminDeleteCar = async (carId, carName) => {
        const confirmed = window.confirm(`Delete car listing "${carName}" permanently? This cannot be undone.`);
        if (!confirmed) return;

        setActionLoadingId(carId);
        try {
            await apiFetch(`/api/admin/cars/${carId}`, { method: "DELETE" });
            toast.success("Car listing deleted successfully.");
            setAllCars(prev => prev.filter(c => c._id !== carId));

            // Update stats
            setAdminStats(prev => prev ? { ...prev, totalCars: Math.max(0, prev.totalCars - 1) } : null);
        } catch (err) {
            toast.error(err.message || "Failed to delete car listing.");
        } finally {
            setActionLoadingId(null);
        }
    };

    // ================= NORMAL USER ACTIONS =================

    const handleUserCancelBooking = async (bookingId, carName) => {
        const confirmed = window.confirm(`Cancel booking for "${carName}"?`);
        if (!confirmed) return;

        setActionLoadingId(bookingId);
        try {
            await apiFetch(`/api/bookings/${bookingId}`, { method: "DELETE" });
            toast.success("Booking cancelled successfully.");
            
            // Update user statistics state
            setUserStats(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    myBookingsCount: Math.max(0, prev.myBookingsCount - 1),
                    recentBookings: prev.recentBookings.filter(b => b._id !== bookingId)
                };
            });
        } catch (err) {
            toast.error(err.message || "Failed to cancel booking.");
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleUserDeleteCar = async (carId, carName) => {
        const confirmed = window.confirm(`Delete car listing "${carName}" permanently?`);
        if (!confirmed) return;

        setActionLoadingId(carId);
        try {
            await apiFetch(`/api/cars/${carId}`, { method: "DELETE" });
            toast.success("Car listing deleted successfully.");
            
            // Update stats state
            setUserStats(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    myCarsCount: Math.max(0, prev.myCarsCount - 1),
                    recentCars: prev.recentCars.filter(c => c._id !== carId)
                };
            });
        } catch (err) {
            toast.error(err.message || "Failed to delete car listing.");
        } finally {
            setActionLoadingId(null);
        }
    };


    // ================= RENDER ADMIN DASHBOARD =================

    const renderAdminDashboard = () => {
        return (
            <div className="space-y-8">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Users size={24} />
                        </div>
                        <div>
                            <span className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Total Users</span>
                            <span className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">{adminStats?.totalUsers || 0}</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Car size={24} />
                        </div>
                        <div>
                            <span className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Active Fleet</span>
                            <span className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">{adminStats?.totalCars || 0}</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <span className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Total Bookings</span>
                            <span className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">{adminStats?.totalBookings || 0}</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 rounded-xl flex items-center justify-center flex-shrink-0">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <span className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Gross Revenue</span>
                            <span className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">${adminStats?.totalRevenue || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Main Section Tabs */}
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden shadow-sm">
                    {/* Tab List */}
                    <div className="flex border-b border-zinc-100 dark:border-zinc-900 overflow-x-auto">
                        {[
                            { id: "overview", label: "Overview", icon: LayoutDashboard },
                            { id: "users", label: "Users", icon: Users },
                            { id: "cars", label: "Cars", icon: Car },
                            { id: "bookings", label: "Bookings", icon: Calendar }
                        ].map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                                        activeTab === tab.id
                                            ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 bg-zinc-50/50 dark:bg-zinc-900/10"
                                            : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                                    }`}
                                >
                                    <Icon size={16} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab Panel */}
                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            {/* OVERVIEW PANEL */}
                            {activeTab === "overview" && (
                                <motion.div
                                    key="overview-tab"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                                            <Activity size={18} className="text-indigo-500" /> Recent Booking Activity
                                        </h3>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                            Latest bookings placed by customers across the platform.
                                        </p>
                                    </div>

                                    {adminStats?.recentBookings?.length === 0 ? (
                                        <div className="text-center py-12 text-zinc-400">
                                            No recent bookings found.
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto border border-zinc-100 dark:border-zinc-900 rounded-xl">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-zinc-50 dark:bg-zinc-900 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-zinc-150 dark:border-zinc-900">
                                                        <th className="p-4">Customer</th>
                                                        <th className="p-4">Vehicle</th>
                                                        <th className="p-4">Booking Dates</th>
                                                        <th className="p-4 text-center">Cost</th>
                                                        <th className="p-4">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-sm divide-y divide-zinc-100 dark:divide-zinc-900 text-zinc-700 dark:text-zinc-300">
                                                    {adminStats?.recentBookings?.map(booking => (
                                                        <tr key={booking._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/5 transition-colors">
                                                            <td className="p-4">
                                                                <div className="font-semibold">{booking.userName}</div>
                                                                <div className="text-xs text-zinc-400">{booking.userEmail}</div>
                                                            </td>
                                                            <td className="p-4 font-semibold">{booking.carName}</td>
                                                            <td className="p-4 text-xs font-semibold">
                                                                {formatDate(booking.startDate)} <ArrowRight size={10} className="inline mx-1" /> {formatDate(booking.endDate)}
                                                            </td>
                                                            <td className="p-4 text-center font-bold text-zinc-900 dark:text-zinc-100">${booking.totalPrice}</td>
                                                            <td className="p-4">
                                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                                                                    <Clock size={10} /> {booking.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* USERS PANEL */}
                            {activeTab === "users" && (
                                <motion.div
                                    key="users-tab"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-4"
                                >
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Manage Registered Users</h3>
                                        <p className="text-sm text-zinc-500">Toggle administrative access or remove users from the platform.</p>
                                    </div>

                                    <div className="overflow-x-auto border border-zinc-100 dark:border-zinc-900 rounded-xl">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-zinc-50 dark:bg-zinc-900 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-zinc-150 dark:border-zinc-900">
                                                    <th className="p-4">User</th>
                                                    <th className="p-4">Email</th>
                                                    <th className="p-4 text-center">Role</th>
                                                    <th className="p-4 text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm divide-y divide-zinc-100 dark:divide-zinc-900 text-zinc-700 dark:text-zinc-300">
                                                {allUsers.map(u => (
                                                    <tr key={u._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/5 transition-colors">
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <img
                                                                    src={u.photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&h=60&q=80"}
                                                                    alt={u.name}
                                                                    className="w-8 h-8 rounded-full object-cover border border-zinc-200/50 dark:border-zinc-800"
                                                                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&h=60&q=80" }}
                                                                />
                                                                <span className="font-semibold">{u.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 font-medium text-zinc-500 dark:text-zinc-400">{u.email}</td>
                                                        <td className="p-4 text-center">
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                                                u.role === "admin" || u.email === "mdnuraalamcse13@gmail.com"
                                                                    ? "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400"
                                                                    : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500"
                                                            }`}>
                                                                {u.role === "admin" || u.email === "mdnuraalamcse13@gmail.com" ? (
                                                                    <ShieldCheck size={12} />
                                                                ) : (
                                                                    <UserX size={12} />
                                                                )}
                                                                {u.role === "admin" || u.email === "mdnuraalamcse13@gmail.com" ? "Admin" : "User"}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button
                                                                    onClick={() => handleToggleRole(u._id, u.role || "user")}
                                                                    disabled={actionLoadingId === u._id || u.email === "mdnuraalamcse13@gmail.com"}
                                                                    className="p-1.5 text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg transition-colors disabled:opacity-30"
                                                                    title="Toggle Admin Access"
                                                                >
                                                                    {u.role === "admin" ? (
                                                                        <ToggleRight size={20} className="text-indigo-500" />
                                                                    ) : (
                                                                        <ToggleLeft size={20} />
                                                                    )}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteUser(u._id, u.email, u.name)}
                                                                    disabled={actionLoadingId === u._id || u.email === "mdnuraalamcse13@gmail.com" || u.email === user.email}
                                                                    className="p-1.5 text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg transition-colors disabled:opacity-30"
                                                                    title="Delete User Account"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )}

                            {/* CARS PANEL */}
                            {activeTab === "cars" && (
                                <motion.div
                                    key="cars-tab"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-4"
                                >
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Explore & Manage Car Listings</h3>
                                        <p className="text-sm text-zinc-500">Overview of all active listings added by user fleet hosts.</p>
                                    </div>

                                    <div className="overflow-x-auto border border-zinc-100 dark:border-zinc-900 rounded-xl">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-zinc-50 dark:bg-zinc-900 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-zinc-150 dark:border-zinc-900">
                                                    <th className="p-4">Car Details</th>
                                                    <th className="p-4">Host</th>
                                                    <th className="p-4">Rental Cost</th>
                                                    <th className="p-4 text-center">Status</th>
                                                    <th className="p-4 text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm divide-y divide-zinc-100 dark:divide-zinc-900 text-zinc-700 dark:text-zinc-300">
                                                {allCars.map(c => (
                                                    <tr key={c._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/5 transition-colors">
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <img
                                                                    src={c.image}
                                                                    alt={c.name}
                                                                    className="w-12 h-9 object-cover rounded-lg border border-zinc-100 dark:border-zinc-800"
                                                                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=80&h=80&q=80" }}
                                                                />
                                                                <div>
                                                                    <div className="font-semibold">{c.name}</div>
                                                                    <div className="text-[10px] text-zinc-400 capitalize">{c.type} • {c.seatCapacity} seats</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="font-semibold text-xs">{c.ownerName || "Unknown Host"}</div>
                                                            <div className="text-[10px] text-zinc-400">{c.ownerEmail}</div>
                                                        </td>
                                                        <td className="p-4 font-bold">${c.price}/day</td>
                                                        <td className="p-4 text-center">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                                c.availability
                                                                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                                                                    : "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400"
                                                            }`}>
                                                                {c.availability ? "Available" : "Unavailable"}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <button
                                                                onClick={() => handleAdminDeleteCar(c._id, c.name)}
                                                                disabled={actionLoadingId === c._id}
                                                                className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all"
                                                                title="Delete Listing"
                                                            >
                                                                <Trash2 size={15} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )}

                            {/* BOOKINGS PANEL */}
                            {activeTab === "bookings" && (
                                <motion.div
                                    key="bookings-tab"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-4"
                                >
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Manage Rental Bookings</h3>
                                        <p className="text-sm text-zinc-500">Overview of all active reservations and cancellation override panel.</p>
                                    </div>

                                    <div className="overflow-x-auto border border-zinc-100 dark:border-zinc-900 rounded-xl">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-zinc-50 dark:bg-zinc-900 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-zinc-150 dark:border-zinc-900">
                                                    <th className="p-4">Customer</th>
                                                    <th className="p-4">Vehicle Details</th>
                                                    <th className="p-4">Duration</th>
                                                    <th className="p-4 text-center">Total Price</th>
                                                    <th className="p-4 text-center">Status</th>
                                                    <th className="p-4 text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm divide-y divide-zinc-100 dark:divide-zinc-900 text-zinc-700 dark:text-zinc-300">
                                                {allBookings.map(b => (
                                                    <tr key={b._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/5 transition-colors">
                                                        <td className="p-4">
                                                            <div className="font-semibold">{b.userName}</div>
                                                            <div className="text-xs text-zinc-400">{b.userEmail}</div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="font-semibold">{b.carName}</div>
                                                            <div className="text-[10px] text-zinc-400">Driver: {b.driverNeeded ? "Included" : "None"}</div>
                                                        </td>
                                                        <td className="p-4 text-xs font-semibold">
                                                            {formatDate(b.startDate)} <ArrowRight size={10} className="inline mx-1" /> {formatDate(b.endDate)}
                                                        </td>
                                                        <td className="p-4 text-center font-bold text-zinc-900 dark:text-zinc-100">${b.totalPrice}</td>
                                                        <td className="p-4 text-center">
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                                                                <Clock size={10} /> {b.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <button
                                                                onClick={() => handleAdminCancelBooking(b._id, b.carName, b.userName)}
                                                                disabled={actionLoadingId === b._id}
                                                                className="px-3 py-1 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg transition-colors"
                                                                title="Cancel Booking"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        );
    };

    // ================= RENDER USER DASHBOARD =================

    const renderUserDashboard = () => {
        return (
            <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <span className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">My Bookings</span>
                            <span className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">{userStats?.myBookingsCount || 0}</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Car size={24} />
                        </div>
                        <div>
                            <span className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Cars Listed</span>
                            <span className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">{userStats?.myCarsCount || 0}</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center flex-shrink-0">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <span className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Total Spent</span>
                            <span className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">${userStats?.totalSpent || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Dashboard Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* User Bookings Section */}
                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
                            <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-50">My Recent Bookings</h3>
                            <Link href="/my-bookings" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                                View All <ArrowRight size={12} />
                            </Link>
                        </div>

                        {userStats?.recentBookings?.length === 0 ? (
                            <div className="text-center py-12 text-zinc-400 text-sm">
                                You have not placed any bookings yet.
                                <Link href="/cars" className="block text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mt-2">
                                    Explore cars & start renting
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {userStats?.recentBookings?.map(booking => (
                                    <div key={booking._id} className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/50 hover:shadow-sm transition-all">
                                        <img
                                            src={booking.carImage}
                                            alt={booking.carName}
                                            className="w-16 h-12 object-cover rounded-lg border border-zinc-200/40"
                                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=80&h=80&q=80" }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 truncate text-sm">{booking.carName}</h4>
                                            <p className="text-xs text-zinc-500">
                                                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="font-bold text-zinc-900 dark:text-zinc-50 text-sm">${booking.totalPrice}</div>
                                            <button
                                                onClick={() => handleUserCancelBooking(booking._id, booking.carName)}
                                                disabled={actionLoadingId === booking._id}
                                                className="text-[10px] font-bold text-red-600 dark:text-red-400 hover:underline mt-1 block"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* User Listings Section */}
                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3">
                            <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-50">My Listed Vehicles</h3>
                            <Link href="/my-cars" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                                View All <ArrowRight size={12} />
                            </Link>
                        </div>

                        {userStats?.recentCars?.length === 0 ? (
                            <div className="text-center py-12 text-zinc-400 text-sm">
                                You have not listed any vehicles yet.
                                <Link href="/add-car" className="block text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mt-2">
                                    Become a host & add your first car
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {userStats?.recentCars?.map(car => (
                                    <div key={car._id} className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/50 hover:shadow-sm transition-all">
                                        <img
                                            src={car.image}
                                            alt={car.name}
                                            className="w-16 h-12 object-cover rounded-lg border border-zinc-200/40"
                                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=80&h=80&q=80" }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 truncate text-sm">{car.name}</h4>
                                            <p className="text-xs text-zinc-500 capitalize">
                                                {car.type} • {car.seatCapacity} seats
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="font-bold text-zinc-900 dark:text-zinc-50 text-sm">${car.price}/day</div>
                                            <button
                                                onClick={() => handleUserDeleteCar(car._id, car.name)}
                                                disabled={actionLoadingId === car._id}
                                                className="text-[10px] font-bold text-red-600 dark:text-red-400 hover:underline mt-1 block"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Dashboard Quick Actions Section */}
                <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 border border-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,transparent)]" />
                    <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2 text-center md:text-left">
                            <h3 className="text-xl font-extrabold">Ready to monetize your empty parking spot?</h3>
                            <p className="text-indigo-200 text-sm max-w-xl">
                                List your car on DriveFleet and join thousands of hosts earning passive income daily with absolute security controls.
                            </p>
                        </div>
                        <div className="flex justify-center flex-shrink-0">
                            <Link href="/add-car" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-950 hover:bg-indigo-50 font-bold text-sm rounded-xl transition-all shadow-md">
                                <Plus size={16} /> Add Your Vehicle
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ================= RENDER MAIN PAGE =================

    return (
        <section className="flex-1 py-10 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-black/95 transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-center sm:text-left">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center justify-center sm:justify-start gap-2">
                            <LayoutDashboard className="text-indigo-500" />
                            {isAdmin ? "Administrator Dashboard" : "My Fleet Dashboard"}
                        </h1>
                        <p className="text-zinc-600 dark:text-zinc-400">
                            {isAdmin 
                                ? "Manage users, listing catalog, reservation bookings, and platform statistics."
                                : "Review bookings status, manage your car listings, and track rental stats."
                            }
                        </p>
                    </div>
                </div>

                {isAdmin ? renderAdminDashboard() : renderUserDashboard()}
            </div>
        </section>
    );
}
