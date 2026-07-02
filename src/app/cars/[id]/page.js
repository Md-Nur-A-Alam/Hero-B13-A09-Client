"use client";

import { use, useEffect, useState } from "react";
import { fetchCarById } from "../../../actions/carActions";
import Spinner from "../../../components/common/Spinner";
import BookingModal from "../../../components/cars/BookingModal";
import useAuth from "../../../hooks/useAuth";
import { MapPin, User, Tag, Calendar, Shield, Info, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CarDetailsPage({ params }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const { user } = useAuth();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    const getCar = async () => {
        try {
            const data = await fetchCarById(id);
            setCar(data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load car details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCar();
    }, [id]);

    if (loading) {
        return <Spinner />;
    }

    if (!car) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-black/95">
                <p className="text-zinc-500">Car listing not found.</p>
                <Link href="/cars" className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline">
                    Back to explore page
                </Link>
            </div>
        );
    }

    return (
        <section className="flex-1 py-10 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-black/95 transition-colors duration-300">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Back button */}
                <Link href="/cars" className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                    <ArrowLeft size={16} /> Back to Vehicles
                </Link>

                {/* Details Container */}
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-2">
                    {/* Left: Image */}
                    <div className="relative aspect-[4/3] lg:aspect-auto bg-zinc-100 dark:bg-zinc-900">
                        <img
                            src={car.image}
                            alt={car.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80" }}
                        />
                        <div className="absolute top-4 left-4">
                            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm text-white ${
                                car.availability ? "bg-emerald-500/90" : "bg-red-500/90"
                            }`}>
                                {car.availability ? "Available" : "Unavailable"}
                            </span>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="p-8 flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                                    {car.type}
                                </span>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                                    {car.name}
                                </h1>
                            </div>

                            {/* Price / features grid */}
                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-zinc-100 dark:border-zinc-900">
                                <div>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Rental Price</p>
                                    <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
                                        ${car.price} <span className="text-xs font-normal text-zinc-500">/ day</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Seat Capacity</p>
                                    <p className="text-lg font-bold text-zinc-800 dark:text-zinc-250 mt-1 flex items-center gap-1.5">
                                        <User size={18} className="text-zinc-400" />
                                        {car.seatCapacity} Seats
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Pickup Location</p>
                                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-250 mt-1.5 flex items-center gap-1.5">
                                        <MapPin size={16} className="text-zinc-400" />
                                        {car.location}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Popularity</p>
                                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-250 mt-1.5 flex items-center gap-1.5">
                                        <Calendar size={16} className="text-zinc-400" />
                                        {car.bookingCount || 0} Bookings
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <h3 className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Info size={14} /> Description
                                </h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    {car.description || "No description provided for this listing."}
                                </p>
                            </div>

                            {/* Listed by / Owner info */}
                            <div className="pt-2 flex items-center gap-2">
                                <Shield size={16} className="text-zinc-400" />
                                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                    Listed by <span className="font-semibold text-zinc-700 dark:text-zinc-300">{car.ownerName || car.ownerEmail}</span>
                                </span>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-6">
                            {car.availability ? (
                                <button
                                    onClick={() => {
                                        if (!user) {
                                            toast.error("Please login to proceed with booking.");
                                            return;
                                        }
                                        setModalOpen(true);
                                    }}
                                    className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                                >
                                    Book Now
                                </button>
                            ) : (
                                <button
                                    disabled
                                    className="w-full bg-zinc-200 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 font-bold py-3.5 px-4 rounded-xl cursor-not-allowed"
                                >
                                    Currently Unavailable
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            <BookingModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                car={car}
                onBookingSuccess={getCar}
            />
        </section>
    );
}
