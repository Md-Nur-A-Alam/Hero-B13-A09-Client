"use client";

import { useEffect, useState } from "react";
import { fetchMyCars, deleteCarListing } from "../actions/carActions";
import Spinner from "../components/common/Spinner";
import UpdateCarModal from "../components/cars/UpdateCarModal";
import DeleteConfirmModal from "../components/cars/DeleteConfirmModal";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import Link from "next/link";
import { Trash2, Edit, MapPin, DollarSign, Tag, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function MyCarsPage() {
    const { user, loading: authLoading } = useAuth();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCar, setSelectedCar] = useState(null);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const getMyCars = async () => {
        try {
            const data = await fetchMyCars();
            setCars(data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load your listings.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            getMyCars();
        }
    }, [user]);

    const handleDelete = async () => {
        if (!selectedCar) return;
        setDeleting(true);
        try {
            await deleteCarListing(selectedCar._id);
            toast.success("Listing deleted successfully!");
            getMyCars();
            setDeleteModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to delete listing.");
        } finally {
            setDeleting(false);
            setSelectedCar(null);
        }
    };

    if (authLoading || loading) {
        return <Spinner />;
    }

    return (
        <section className="flex-1 py-10 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-black/95 transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                            My Listed Cars
                        </h1>
                        <p className="text-zinc-600 dark:text-zinc-400">
                            Manage and update the vehicle listings you have added to DriveFleet.
                        </p>
                    </div>
                    <Link
                        href="/add-car"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-md shadow-indigo-500/10 text-center"
                    >
                        Add New Car
                    </Link>
                </div>

                {/* Cars Grid */}
                {cars.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl">
                        <p className="text-zinc-500 dark:text-zinc-400">You haven't listed any cars yet.</p>
                        <Link
                            href="/add-car"
                            className="inline-block mt-4 text-indigo-600 dark:text-indigo-400 hover:underline font-bold text-sm"
                        >
                            Create your first listing now
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cars.map((car) => (
                            <motion.div
                                key={car._id}
                                layout
                                className="flex flex-col h-full bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                            >
                                {/* Image aspect */}
                                <div className="relative aspect-[16/10] bg-zinc-100 dark:bg-zinc-900">
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
                                    <div className="absolute bottom-4 right-4 bg-zinc-950/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-bold">
                                        ${car.price}/day
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex flex-col flex-1 p-5 space-y-4">
                                    <div className="space-y-1">
                                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                            {car.type}
                                        </span>
                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 truncate">
                                            {car.name}
                                        </h3>
                                    </div>

                                    {/* Location / capacity info */}
                                    <div className="flex flex-col gap-2 text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-900 pt-3">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={14} className="text-zinc-400" />
                                            <span>{car.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Users size={14} className="text-zinc-400" />
                                            <span>{car.seatCapacity} Seats</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-3 mt-auto">
                                        <button
                                            onClick={() => {
                                                setSelectedCar(car);
                                                setUpdateModalOpen(true);
                                            }}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-semibold text-xs rounded-xl transition-all"
                                        >
                                            <Edit size={14} /> Update
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedCar(car);
                                                setDeleteModalOpen(true);
                                            }}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-650 dark:text-red-400 font-semibold text-xs rounded-xl transition-all"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Update Car Modal */}
            {selectedCar && updateModalOpen && (
                <UpdateCarModal
                    isOpen={updateModalOpen}
                    onClose={() => {
                        setUpdateModalOpen(false);
                        setSelectedCar(null);
                    }}
                    car={selectedCar}
                    onUpdateSuccess={getMyCars}
                />
            )}

            {/* Delete Confirmation Modal */}
            {selectedCar && deleteModalOpen && (
                <DeleteConfirmModal
                    isOpen={deleteModalOpen}
                    onClose={() => {
                        setDeleteModalOpen(false);
                        setSelectedCar(null);
                    }}
                    onConfirm={handleDelete}
                    carName={selectedCar.name}
                    loading={deleting}
                />
            )}
        </section>
    );
}
