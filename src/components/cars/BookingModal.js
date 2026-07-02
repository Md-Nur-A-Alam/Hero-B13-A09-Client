"use client";

import { useState, useEffect } from "react";
import { createBooking } from "../../actions/carActions";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { Calendar, User, Clipboard, DollarSign, X } from "lucide-react";

export default function BookingModal({ isOpen, onClose, car, onBookingSuccess }) {
    const { user } = useAuth();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [driverNeeded, setDriverNeeded] = useState(false);
    const [specialNote, setSpecialNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);

    // Live total price calculation
    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (start < end) {
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
                setTotalPrice(diffDays * car.price);
            } else {
                setTotalPrice(0);
            }
        } else {
            setTotalPrice(0);
        }
    }, [startDate, endDate, car.price]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            toast.error("Please login to book a car.");
            return;
        }

        if (!startDate || !endDate) {
            return toast.error("Please select start and end dates.");
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        today.setHours(0,0,0,0);

        if (start < today) {
            return toast.error("Start date cannot be in the past.");
        }

        if (start >= end) {
            return toast.error("End date must be after the start date.");
        }

        setLoading(true);
        try {
            await createBooking({
                carId: car._id,
                startDate,
                endDate,
                driverNeeded,
                specialNote
            });
            toast.success("Booking confirmed successfully!");
            onBookingSuccess();
            onClose();
        } catch (error) {
            toast.error(error.message || "Failed to confirm booking.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-950">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                            Book {car.name}
                        </h2>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                            Daily Rent Rate: ${car.price}/day
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Start Date */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                                Start Date
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                                    <Calendar size={16} />
                                </span>
                                <input
                                    type="date"
                                    required
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-500 text-sm"
                                />
                            </div>
                        </div>

                        {/* End Date */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                                End Date
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                                    <Calendar size={16} />
                                </span>
                                <input
                                    type="date"
                                    required
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-500 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Driver needed (Toggle) */}
                    <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
                        <div className="flex items-center gap-2">
                            <User size={18} className="text-zinc-500" />
                            <div>
                                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Need a Professional Driver?</h4>
                                <p className="text-xs text-zinc-500">Available at no additional vehicle cost</p>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            checked={driverNeeded}
                            onChange={(e) => setDriverNeeded(e.target.checked)}
                            className="w-5 h-5 accent-indigo-600 rounded-md cursor-pointer focus:ring-0"
                        />
                    </div>

                    {/* Special Notes */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                            Special Instructions / Notes
                        </label>
                        <div className="relative">
                            <span className="absolute top-3 left-3 text-zinc-400">
                                <Clipboard size={16} />
                            </span>
                            <textarea
                                value={specialNote}
                                onChange={(e) => setSpecialNote(e.target.value)}
                                placeholder="E.g. child seat, pickup details..."
                                rows="3"
                                className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-500 text-sm resize-none"
                            ></textarea>
                        </div>
                    </div>

                    {/* Live Calculator pricing info */}
                    {totalPrice > 0 && (
                        <div className="flex items-center justify-between p-3.5 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                            <span className="text-sm text-indigo-900 dark:text-indigo-300 font-medium">Estimated Rental Cost</span>
                            <span className="text-lg font-extrabold text-indigo-700 dark:text-indigo-400 flex items-center">
                                <DollarSign size={18} />
                                {totalPrice}
                            </span>
                        </div>
                    )}

                    {/* Submit */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md shadow-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Confirming..." : "Book Now"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
