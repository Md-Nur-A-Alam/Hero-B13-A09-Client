"use client";

import { useEffect, useState } from "react";
import { fetchMyBookings, cancelBooking } from "../../actions/carActions";
import Spinner from "../../components/common/Spinner";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, DollarSign, UserCheck, UserX, Clock, ArrowRight, MessageSquare, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MyBookingsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState("newest");
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const getMyBookings = async () => {
            try {
                const data = await fetchMyBookings();
                setBookings(data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load your bookings.");
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            getMyBookings();
        }
    }, [user]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateStr).toLocaleDateString(undefined, options);
    };

    const handleCancel = async (bookingId, carName) => {
        const confirmed = window.confirm(`Cancel your booking for "${carName}"? This cannot be undone.`);
        if (!confirmed) return;

        setCancellingId(bookingId);
        try {
            await cancelBooking(bookingId);
            toast.success("Booking cancelled successfully.");
            setBookings((prev) => prev.filter((b) => b._id !== bookingId));
        } catch (err) {
            toast.error(err.message || "Failed to cancel booking.");
        } finally {
            setCancellingId(null);
        }
    };

    const sortedBookings = [...bookings].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    if (authLoading || loading) {
        return <Spinner fullPage />;
    }

    return (
        <section className="flex-1 py-10 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-black/95 transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                            My Bookings
                        </h1>
                        <p className="text-zinc-600 dark:text-zinc-400">
                            View and manage your active vehicle rental reservations.
                        </p>
                    </div>

                    {/* Sort Toggle */}
                    {bookings.length > 0 && (
                        <button
                            onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                        >
                            {sortOrder === "newest" ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                            {sortOrder === "newest" ? "Newest First" : "Oldest First"}
                        </button>
                    )}
                </div>

                {bookings.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20 bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl"
                    >
                        <Calendar size={48} className="mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium">You don&apos;t have any bookings yet.</p>
                        <Link
                            href="/cars"
                            className="inline-flex items-center gap-1 mt-4 text-indigo-600 dark:text-indigo-400 hover:underline font-bold text-sm"
                        >
                            Explore vehicles and make your first booking <ArrowRight size={14} />
                        </Link>
                    </motion.div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-150 dark:border-zinc-900 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                        <th className="py-4 px-6">Vehicle</th>
                                        <th className="py-4 px-6">Rental Dates</th>
                                        <th className="py-4 px-6 text-center">Driver</th>
                                        <th className="py-4 px-6">Special Note</th>
                                        <th className="py-4 px-6">Total Cost</th>
                                        <th className="py-4 px-6">Status</th>
                                        <th className="py-4 px-6 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 text-sm">
                                    <AnimatePresence>
                                        {sortedBookings.map((booking) => (
                                            <motion.tr
                                                key={booking._id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors"
                                            >
                                                {/* Car Info */}
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={booking.carImage}
                                                            alt={booking.carName}
                                                            className="w-14 h-10 object-cover rounded-lg border border-zinc-200/50 dark:border-zinc-800"
                                                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=80&h=80&q=80" }}
                                                        />
                                                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">{booking.carName}</span>
                                                    </div>
                                                </td>

                                                {/* Dates */}
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                                        <span>{formatDate(booking.startDate)}</span>
                                                        <ArrowRight size={12} className="text-zinc-400" />
                                                        <span>{formatDate(booking.endDate)}</span>
                                                    </div>
                                                </td>

                                                {/* Driver */}
                                                <td className="py-4 px-6 text-center">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                                                        booking.driverNeeded
                                                            ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                                                            : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500"
                                                    }`}>
                                                        {booking.driverNeeded ? <UserCheck size={12} /> : <UserX size={12} />}
                                                        {booking.driverNeeded ? "Yes" : "No"}
                                                    </span>
                                                </td>

                                                {/* Notes */}
                                                <td className="py-4 px-6 max-w-xs truncate text-xs text-zinc-500 dark:text-zinc-400" title={booking.specialNote}>
                                                    {booking.specialNote || <span className="text-zinc-300 italic">None</span>}
                                                </td>

                                                {/* Cost */}
                                                <td className="py-4 px-6 font-bold text-zinc-900 dark:text-zinc-100">
                                                    ${booking.totalPrice}
                                                </td>

                                                {/* Status */}
                                                <td className="py-4 px-6">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold">
                                                        <Clock size={12} />
                                                        {booking.status}
                                                    </span>
                                                </td>

                                                {/* Cancel */}
                                                <td className="py-4 px-6 text-center">
                                                    <button
                                                        onClick={() => handleCancel(booking._id, booking.carName)}
                                                        disabled={cancellingId === booking._id}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 transition-all disabled:opacity-50"
                                                    >
                                                        <Trash2 size={12} />
                                                        {cancellingId === booking._id ? "..." : "Cancel"}
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Grid Cards View */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden">
                            <AnimatePresence>
                                {sortedBookings.map((booking) => (
                                    <motion.div
                                        key={booking._id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 p-5 rounded-2xl shadow-sm space-y-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={booking.carImage}
                                                alt={booking.carName}
                                                className="w-16 h-12 object-cover rounded-lg border border-zinc-200/50 dark:border-zinc-800"
                                                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=80&h=80&q=80" }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{booking.carName}</h3>
                                                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-extrabold">${booking.totalPrice} Total</p>
                                            </div>
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold shrink-0">
                                                <Clock size={10} />
                                                {booking.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-xs border-t border-zinc-100 dark:border-zinc-900 pt-3">
                                            <div className="col-span-2">
                                                <span className="text-zinc-400 uppercase tracking-wider block mb-0.5">Rental Dates</span>
                                                <div className="flex items-center gap-1 font-semibold text-zinc-700 dark:text-zinc-300">
                                                    <span>{formatDate(booking.startDate)}</span>
                                                    <ArrowRight size={12} className="text-zinc-400" />
                                                    <span>{formatDate(booking.endDate)}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-zinc-400 uppercase tracking-wider block mb-0.5">Driver</span>
                                                <span className={`inline-flex items-center gap-1 font-bold ${
                                                    booking.driverNeeded ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-500"
                                                }`}>
                                                    {booking.driverNeeded ? <UserCheck size={12} /> : <UserX size={12} />}
                                                    {booking.driverNeeded ? "Included" : "Self Drive"}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-zinc-400 uppercase tracking-wider block mb-0.5">Booked On</span>
                                                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                                                    {formatDate(booking.bookingDate || booking.createdAt)}
                                                </span>
                                            </div>
                                        </div>

                                        {booking.specialNote && (
                                            <div className="p-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-850 rounded-xl flex gap-1.5 items-start text-xs text-zinc-500">
                                                <MessageSquare size={14} className="mt-0.5 flex-shrink-0" />
                                                <span>{booking.specialNote}</span>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => handleCancel(booking._id, booking.carName)}
                                            disabled={cancellingId === booking._id}
                                            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 transition-all disabled:opacity-50"
                                        >
                                            <Trash2 size={13} />
                                            {cancellingId === booking._id ? "Cancelling..." : "Cancel Booking"}
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
