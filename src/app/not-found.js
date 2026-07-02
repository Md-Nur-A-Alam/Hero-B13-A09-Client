"use client";

import Link from "next/link";
import { ArrowLeft, Ban } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
    return (
        <section className="flex-1 flex flex-col items-center justify-center py-16 px-4 bg-zinc-50 dark:bg-black/95 text-center transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="max-w-md w-full space-y-6 bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 p-8 rounded-3xl shadow-xl"
            >
                <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-650 dark:text-red-400 mx-auto">
                    <Ban size={32} />
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                        404
                    </h1>
                    <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                        Page Not Found
                    </h2>
                    <p className="text-sm text-zinc-550 dark:text-zinc-400">
                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>
                </div>

                <div className="pt-2">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md shadow-indigo-500/10 w-full"
                    >
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}
