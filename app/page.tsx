"use client";

import { useEffect, useState } from "react";
import {
    FiActivity,
    FiRefreshCw,
    FiServer,
    FiCpu,
    FiArrowRight,
    FiZap,
    FiTrendingUp,
} from "react-icons/fi";
import HealthStats from "@/components/cards/HealthStatsCard";
import { getHealth, getServices } from "@/utils/api";
import { HealthStatus, Service } from "@/types";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
    const [health, setHealth] = useState<HealthStatus | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [servicesLoading, setServicesLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchHealth = async () => {
        try {
            const response = await getHealth();
            setHealth(response.data);
            setError(null);
        } catch (err) {
            const errorMessage = "Failed to fetch health data";
            setError(errorMessage);
            toast.error(errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchServices = async () => {
        setServicesLoading(true);
        try {
            const response = await getServices();
            const servicesData = response.data?.data ?? [];
        
            const mappedServices: Service[] = servicesData.map((service: any) => ({
                displayName: service.displayName,
                name: service.name,
                isActive: service.isActive,
            }));
        
            setServices(mappedServices);
        } catch (err) {
            console.error("Failed to fetch services:", err);
        } finally {
            setServicesLoading(false);
        }
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        Promise.all([fetchHealth(), fetchServices()]).then(() => {
            setIsRefreshing(false);
            toast.success("Dashboard refreshed");
        });
    };

    useEffect(() => {
        fetchHealth();
        fetchServices();

        const interval = setInterval(() => {
            fetchHealth();
            fetchServices();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const runningServices = services.filter((s) => s.isActive).length;
const stoppedServices = services.filter((s) => !s.isActive).length;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <FiActivity className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold">System Dashboard</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Monitor system health and manage services from a single
                        dashboard
                    </p>
                </div>
                <motion.button
                    whileHover={{
                        scale: 1.05,
                        boxShadow:
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-all duration-300 shadow-sm"
                >
                    <FiRefreshCw
                        className={`w-4 h-4 ${
                            isRefreshing ? "animate-spin" : ""
                        }`}
                    />
                    <span className="font-medium">
                        {isRefreshing ? "Refreshing..." : "Refresh"}
                    </span>
                </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-card rounded-2xl shadow-xl border border-border p-6 relative overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-chart-3/5 rounded-full blur-2xl"></div>

                    <div className="relative">
                        <div className="flex items-center space-x-3 mb-5">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <FiCpu className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold">System Health</h2>
                        </div>
                        <HealthStats
                            health={health}
                            loading={loading}
                            error={error}
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-card rounded-2xl shadow-xl border border-border p-6 relative overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-chart-1/5 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-chart-4/5 rounded-full blur-2xl"></div>

                    <div className="relative">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <FiServer className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold">
                                    Services Overview
                                </h2>
                            </div>
                            <Link
                                href="/services"
                                className="text-sm text-primary hover:underline flex items-center space-x-1 font-medium"
                            >
                                <span>View all</span>
                                <FiArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {servicesLoading ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="bg-green-500/10 rounded-xl p-5 text-center border border-green-500/20 relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-500/5 opacity-30"></div>
                                        <div className="relative">
                                            <div className="flex justify-center mb-2">
                                                <div className="p-2 bg-green-500/20 rounded-lg">
                                                    <FiZap className="w-5 h-5 text-green-500" />
                                                </div>
                                            </div>
                                            <p className="text-green-500 text-3xl font-bold mb-1">
                                                {runningServices}
                                            </p>
                                            <p className="text-sm font-medium text-green-600/80">
                                                Running Services
                                            </p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="bg-red-500/10 rounded-xl p-5 text-center border border-red-500/20 relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-500/5 opacity-30"></div>
                                        <div className="relative">
                                            <div className="flex justify-center mb-2">
                                                <div className="p-2 bg-red-500/20 rounded-lg">
                                                    <FiTrendingUp className="w-5 h-5 text-red-500" />
                                                </div>
                                            </div>
                                            <p className="text-red-500 text-3xl font-bold mb-1">
                                                {stoppedServices}
                                            </p>
                                            <p className="text-sm font-medium text-red-600/80">
                                                Stopped Services
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="space-y-3 mt-5">
                                    <h3 className="text-sm font-medium text-muted-foreground">
                                        Recent Services
                                    </h3>
                                    {services
                                        .slice(0, 3)
                                        .map((service, index) => (
                                            <motion.div
                                                key={service.name}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{
                                                    delay: 0.5 + index * 0.1,
                                                }}
                                                className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border hover:border-primary/30 hover:bg-background transition-colors duration-200"
                                            >
                                                <div className="flex items-center space-x-3">
                                                <div
                            className={`w-2.5 h-2.5 rounded-full ${
                                service.isActive
                                    ? "bg-green-500"
                                    : "bg-red-500"
                            } animate-pulse`}
                        ></div>
                                                    <span className="font-medium">
                                                        {service.displayName}
                                                    </span>
                                                </div>
                                                <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                            service.isActive
                                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                : "bg-red-500/10 text-red-500 border border-red-500/20"
                        }`}
                    >
                        {service.isActive ? "running" : "stopped"}
                    </span>
                                            </motion.div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
