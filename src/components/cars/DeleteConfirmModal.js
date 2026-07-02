"use client";

import { X, AlertTriangle } from "lucide-react";

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, carName, loading }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-6 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-600 dark:text-red-400">
                            <AlertTriangle size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                            Delete Listing?
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-650"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Are you sure you want to permanently delete the listing for <span className="font-bold text-zinc-900 dark:text-zinc-100">{carName}</span>?
                    </p>
                    <p className="text-xs text-red-500 font-semibold">
                        This action cannot be undone and will delete all associated listing information.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all shadow-md shadow-red-500/10 disabled:opacity-50"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
