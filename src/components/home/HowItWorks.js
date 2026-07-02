"use client";

import { howItWorksData } from "../../data/staticData";

export default function HowItWorks() {
    return (
        <section className="py-16 bg-zinc-50/50 dark:bg-zinc-950/20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
                        How It Works
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-3">
                        Rent your dream car in three simple, hassle-free steps.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {howItWorksData.map((item, index) => (
                        <div key={item.id} className="relative p-6 space-y-4">
                            {/* Connective lines for desktop */}
                            {index < 2 && (
                                <div className="hidden md:block absolute top-1/2 left-[calc(100%_-_2rem)] w-16 border-t-2 border-dashed border-zinc-200 dark:border-zinc-800 -translate-y-1/2 z-0"></div>
                            )}
                            
                            <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-violet-500 text-white flex items-center justify-center font-extrabold text-xl mx-auto shadow-lg shadow-indigo-500/20">
                                {item.step}
                            </div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                {item.title}
                            </h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xs mx-auto">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
