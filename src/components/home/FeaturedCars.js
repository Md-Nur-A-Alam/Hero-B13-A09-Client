"use client";

import { useEffect, useState } from "react";
import { fetchCars } from "../../actions/carActions";
import CarCard from "../cars/CarCard";
import Spinner from "../common/Spinner";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FeaturedCars() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCars = async () => {
            try {
                const data = await fetchCars();
                setCars(data.slice(0, 6)); // Show first 6 cards
            } catch (error) {
                console.error("Failed to load featured cars:", error);
            } finally {
                setLoading(false);
            }
        };
        getCars();
    }, []);

    if (loading) {
        return (
            <div className="py-16 text-center">
                <Spinner />
            </div>
        );
    }

    return (
        <section className="py-16 bg-zinc-50/50 dark:bg-zinc-950/20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
                            Our Featured Fleet
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                            Explore some of our most popular rental vehicles available today.
                        </p>
                    </div>
                    <Link
                        href="/cars"
                        className="group inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-bold transition-all text-sm"
                    >
                        Browse all vehicles
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {cars.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-8">
                        <p className="text-zinc-500 dark:text-zinc-400">No cars found in the database. Start adding cars to see them here!</p>
                        <Link
                            href="/add-car"
                            className="inline-block mt-4 bg-indigo-600 text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-indigo-700"
                        >
                            Add Your First Car
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cars.map((car) => (
                            <CarCard key={car._id} car={car} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
