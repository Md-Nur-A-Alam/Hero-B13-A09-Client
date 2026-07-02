"use client";

import { useState } from "react";
import { updateCarListing } from "../../actions/carActions";
import toast from "react-hot-toast";
import { X, DollarSign, Image, MapPin, Layers } from "lucide-react";

export default function UpdateCarModal({ isOpen, onClose, car, onUpdateSuccess }) {
    const [price, setPrice] = useState(car.price);
    const [description, setDescription] = useState(car.description || "");
    const [availability, setAvailability] = useState(car.availability);
    const [image, setImage] = useState(car.image);
    const [type, setType] = useState(car.type);
    const [location, setLocation] = useState(car.location);
    const [submitting, setSubmitting] = useState(false);

    const carTypes = ["SUV", "Sedan", "Hatchback", "Luxury", "Truck", "Van", "Hybrid", "Electric"];

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!price || !image || !type || !location) {
            return toast.error("Please fill in all required fields.");
        }

        setSubmitting(true);
        try {
            await updateCarListing(car._id, {
                price: Number(price),
                description,
                availability,
                image,
                type,
                location
            });
            toast.success("Listing updated successfully!");
            onUpdateSuccess();
            onClose();
        } catch (error) {
            toast.error(error.message || "Failed to update listing.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-950">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                        Update {car.name}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    {/* Price */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                            <DollarSign size={14} /> Daily Rent Price ($)
                        </label>
                        <input
                            type="number"
                            required
                            min="1"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                        />
                    </div>

                    {/* Car Type */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                            <Layers size={14} /> Car Type
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm cursor-pointer"
                        >
                            {carTypes.map((t) => (
                                <option key={t} value={t} className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-150">{t}</option>
                            ))}
                        </select>
                    </div>

                    {/* Image URL */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                            <Image size={14} /> Image URL
                        </label>
                        <input
                            type="url"
                            required
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                        />
                    </div>

                    {/* Pickup Location */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                            <MapPin size={14} /> Pickup Location
                        </label>
                        <input
                            type="text"
                            required
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm resize-none"
                        ></textarea>
                    </div>

                    {/* Availability */}
                    <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
                        <div>
                            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Availability Status</h4>
                            <p className="text-xs text-zinc-500">Uncheck to mark this vehicle as unavailable</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={availability}
                            onChange={(e) => setAvailability(e.target.checked)}
                            className="w-5 h-5 accent-indigo-600 rounded-md cursor-pointer focus:ring-0"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-500/10 disabled:opacity-50"
                        >
                            {submitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
