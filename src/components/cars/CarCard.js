"use client";

import Link from "next/link";
import { Car, MapPin, User, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function CarCard({ car }) {
    const { _id, name, price, type, image, seatCapacity, location, availability, bookingCount } = car;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-col h-full bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        >
            {/* Image section */}
            <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80" }}
                />
                
                {/* Availability Badge */}
                <div className="absolute top-4 left-4">
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm ${
                        availability 
                            ? "bg-emerald-500/90 text-white" 
                            : "bg-red-500/90 text-white"
                    }`}>
                        {availability ? "Available" : "Unavailable"}
                    </span>
                </div>

                {/* Price tag */}
                <div className="absolute bottom-4 right-4 bg-zinc-950/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-bold">
                    ${price}/day
                </div>
            </div>

            {/* Content section */}
            <div className="flex flex-col flex-1 p-5 space-y-4">
                <div className="space-y-1">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                        {type}
                    </span>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {name}
                    </h3>
                </div>

                {/* Features row */}
                <div className="grid grid-cols-2 gap-3 text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-900 pt-3">
                    <div className="flex items-center gap-1.5">
                        <User size={14} className="text-zinc-400" />
                        <span>{seatCapacity} Seats</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-zinc-400" />
                        <span className="truncate">{location}</span>
                    </div>
                    {bookingCount !== undefined && (
                        <div className="flex items-center gap-1.5 col-span-2">
                            <Calendar size={14} className="text-zinc-400" />
                            <span>{bookingCount} Bookings</span>
                        </div>
                    )}
                </div>

                {/* Action button */}
                <div className="mt-auto pt-3">
                    <Link
                        href={`/cars/${_id}`}
                        className="flex items-center justify-center w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
