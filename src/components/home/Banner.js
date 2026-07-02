"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Banner() {
    return (
        <section className="relative overflow-hidden bg-white dark:bg-black py-20 lg:py-32 transition-colors duration-300">
            {/* Background decorative gradients */}
            <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-900/10"></div>
            <div className="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-900/10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                            Find Your Perfect Ride with{" "}
                            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 text-transparent bg-clip-text">
                                DriveFleet
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-xl">
                            Unlock premium rental experiences with uncompromised pricing, verified listings, and secure online reservation management.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4">
                            <Link
                                href="/cars"
                                className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-full transition-all shadow-lg shadow-indigo-500/20 w-full sm:w-auto justify-center"
                            >
                                Explore Cars
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/register"
                                className="border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-semibold px-8 py-3.5 rounded-full transition-all w-full sm:w-auto justify-center flex"
                            >
                                Get Started
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Premium Mockup image or shape */}
                        <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl relative">
                            <img
                                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80"
                                alt="Premium Sports Car Rental Banner"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                                <span className="bg-indigo-600/90 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
                                    New Addition
                                </span>
                                <h3 className="text-xl font-bold mt-2">Audi RS e-tron GT</h3>
                                <p className="text-sm text-zinc-200 mt-1">Available in Cityville starting at $150/day</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
