"use client";

import { whyChooseUsData } from "../../data/staticData";
import { Car, DollarSign, Calendar, ShieldCheck } from "lucide-react";

export default function WhyChooseUs() {
    // Dynamic icon mapper helper
    const getIcon = (iconName) => {
        switch (iconName) {
            case "Car":
                return <Car className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
            case "DollarSign":
                return <DollarSign className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
            case "Calendar":
                return <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
            case "ShieldCheck":
                return <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
            default:
                return <Car className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
        }
    };

    return (
        <section className="py-16 bg-white dark:bg-black transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
                        Why Choose DriveFleet?
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-3">
                        We are dedicated to providing the smoothest car rental service with verified cars and premium customer support.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {whyChooseUsData.map((item) => (
                        <div
                            key={item.id}
                            className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl text-left space-y-4 hover:shadow-md transition-shadow"
                        >
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
                                {getIcon(item.iconName)}
                            </div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                {item.title}
                            </h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
