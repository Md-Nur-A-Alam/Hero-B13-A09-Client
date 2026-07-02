"use client";

import { useEffect, useState } from "react";
import { fetchMyBookings } from "../actions/carActions";
import Spinner from "../components/common/Spinner";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import Link from "next/link";
import { Calendar, DollarSign, UserCheck, UserX, Clock, ArrowRight, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function MyBookingsPage() {
    const { user, loading: authLoading } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (authLoading || loading) {
        return <Spinner />;
    }

    return (
        <section className="flex-1 py-10 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-black/95 transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                        My Bookings
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        View and manage your active vehicle rental reservations.
                    </p>
                </div>

                {bookings.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl">
                        <p className="text-zinc-500 dark:text-zinc-400">You don't have any bookings yet.</p>
                        <Link
                            href="/cars"
                            className="inline-block mt-4 text-indigo-600 dark:text-indigo-400 hover:underline font-bold text-sm"
                        >
                            Explore vehicles and make your first booking
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-150 dark:border-zinc-900 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                        <th className="py-4 px-6">Vehicle</th>
                                        <th className="py-4 px-6">Rental Dates</th>
                                        <th className="py-4 px-6 text-center">Driver Needed</th>
                                        <th className="py-4 px-6">Special Note</th>
                                        <th className="py-4 px-6">Total Cost</th>
                                        <th className="py-4 px-6">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 text-sm">
                                    {bookings.map((booking) => (
                                        <tr key={booking._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors">
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Grid Cards View */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden">
                            {bookings.map((booking) => (
                                <motion.div
                                    key={booking._id}
                                    className="bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 p-5 rounded-2xl shadow-sm space-y-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={booking.carImage}
                                            alt={booking.carName}
                                            className="w-16 h-12 object-cover rounded-lg border border-zinc-250 dark:border-zinc-850"
                                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=80&h=80&q=80" }}
                                        />
                                        <div>
                                            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{booking.carName}</h3>
                                            <p className="text-xs text-indigo-650 dark:text-indigo-400 font-extrabold">${booking.totalPrice} Total Cost</p>
                                        </div>
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
                                            <span className="text-zinc-400 uppercase tracking-wider block mb-0.5">Driver Option</span>
                                            <span className={`inline-flex items-center gap-1 font-bold ${
                                                booking.driverNeeded ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-500"
                                            }`}>
                                                {booking.driverNeeded ? "Driver Included" : "Self Drive"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-zinc-400 uppercase tracking-wider block mb-0.5">Status</span>
                                            <span className="text-emerald-650 dark:text-emerald-400 font-bold">
                                                Confirmed
                                            </span>
                                        </div>
                                    </div>

                                    {booking.specialNote && (
                                        <div className="p-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-150 dark:border-zinc-850 rounded-xl flex gap-1.5 items-start text-xs text-zinc-500">
                                            <MessageSquare size={14} className="mt-0.5 flex-shrink-0" />
                                            <span>{booking.specialNote}</span>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
