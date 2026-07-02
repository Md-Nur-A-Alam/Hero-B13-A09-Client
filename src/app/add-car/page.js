"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCarListing } from "../../actions/carActions";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { PlusCircle, Info, MapPin, DollarSign, Image, Users, Layers } from "lucide-react";
import { motion } from "framer-motion";

export default function AddCarPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [type, setType] = useState("SUV");
    const [image, setImage] = useState("");
    const [seatCapacity, setSeatCapacity] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [availability, setAvailability] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const carTypes = ["SUV", "Sedan", "Hatchback", "Luxury", "Truck", "Van", "Hybrid", "Electric"];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !price || !type || !image || !seatCapacity || !location) {
            return toast.error("Please fill in all required fields.");
        }

        setSubmitting(true);
        try {
            await createCarListing({
                name,
                price: Number(price),
                type,
                image,
                seatCapacity: Number(seatCapacity),
                location,
                description,
                availability
            });
            toast.success("Car listing created successfully!");
            router.push("/my-cars");
        } catch (error) {
            toast.error(error.message || "Failed to create listing.");
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading) return null;

    return (
        <section className="flex-1 py-10 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-black/95 transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 sm:p-10 shadow-xl space-y-8"
            >
                <div className="text-center sm:text-left space-y-2">
                    <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                        Add a Car Listing
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Fill in the details below to list your vehicle for rent.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Car Name */}
                        <div className="space-y-1 sm:col-span-2">
                            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                                Car Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="E.g. Tesla Model Y, BMW 3 Series..."
                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-500 text-sm transition-all"
                            />
                        </div>

                        {/* Daily Rent Price */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                                <DollarSign size={14} /> Daily Rent Price ($) *
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="99"
                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-500 text-sm transition-all"
                            />
                        </div>

                        {/* Car Type */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                                <Layers size={14} /> Car Type *
                            </label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-500 text-sm transition-all cursor-pointer"
                            >
                                {carTypes.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        {/* Image URL */}
                        <div className="space-y-1 sm:col-span-2">
                            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                                <Image size={14} /> Image URL (Imgbb/Postimage) *
                            </label>
                            <input
                                type="url"
                                required
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                placeholder="https://i.ibb.co/..."
                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-500 text-sm transition-all"
                            />
                        </div>

                        {/* Seat Capacity */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                                <Users size={14} /> Seat Capacity *
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={seatCapacity}
                                onChange={(e) => setSeatCapacity(e.target.value)}
                                placeholder="5"
                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-500 text-sm transition-all"
                            />
                        </div>

                        {/* Pickup Location */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                                <MapPin size={14} /> Pickup Location *
                            </label>
                            <input
                                type="text"
                                required
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="E.g. Cityville Airport, Downtown..."
                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-500 text-sm transition-all"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-1 sm:col-span-2">
                            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                                <Info size={14} /> Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Tell us more about the vehicle specs, features, condition..."
                                rows="4"
                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-500 text-sm transition-all resize-none"
                            ></textarea>
                        </div>

                        {/* Availability */}
                        <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 sm:col-span-2">
                            <div>
                                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Set Available Immediately?</h4>
                                <p className="text-xs text-zinc-500">If disabled, this vehicle won't be open for bookings</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={availability}
                                onChange={(e) => setAvailability(e.target.checked)}
                                className="w-5 h-5 accent-indigo-600 rounded-md cursor-pointer focus:ring-0"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md shadow-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? "Adding Listing..." : (
                            <>
                                <PlusCircle size={18} /> Add Vehicle Listing
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </section>
    );
}
