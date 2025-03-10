"use client";

import { useEffect, useState } from "react";
import {
    FiHome,
    FiRefreshCw,
    FiServer,
    FiCpu,
    FiArrowRight,
    FiZap,
    FiClock,
    FiLayers,
    FiCheckCircle,
    FiXCircle
} from "react-icons/fi";
import HealthStats from "@/components/cards/HealthStatsCard";
import { getHealth, getServices } from "@/utils/api";
import { HealthStatus, Service } from "@/types";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Home() {
    const [health, setHealth] = useState<HealthStatus | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [servicesLoading, setServicesLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [systemStatus, setSystemStatus] = useState<"Operational" | "Degraded" | "Stopped">("Stopped");

    const fetchHealth = async () => {
        const startTime = performance.now();
        try {
            const response = await getHealth();
            const endTime = performance.now(); 
            const responseTime = endTime - startTime; 
    
            setHealth(response.data);
            setError(null);
    
            // Determine system status based on response time
            if (responseTime < 500) {
                setSystemStatus("Operational");
            } else if (responseTime < 2000) {
                setSystemStatus("Degraded");
            } else {
                setSystemStatus("Stopped");
            }
        } catch (err) {
            setError("Failed to fetch health data");
            setSystemStatus("Stopped");
            toast.error("Failed to fetch health data");
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
            {/* Ultra Premium Header Section */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 relative"
            >
                {/* Enhanced decorative background elements */}
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-bl from-blue-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
                
                <div className="relative">
                    <div className="flex items-center space-x-4 mb-3">
                        <motion.div 
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ 
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                                delay: 0.1
                            }}
                            className="p-4 bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 rounded-2xl shadow-xl border border-primary/20 backdrop-blur-xl"
                        >
                            <FiHome className="w-10 h-10 text-primary" />
                        </motion.div>
                        <div>
                            <motion.h1 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-5xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent tracking-tight"
                            >
                                System Dashboard
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-lg text-muted-foreground/80 mt-2"
                            >
                                Monitor system health and manage services in real-time
                            </motion.p>
                        </div>
                    </div>

                    {/* Quick Stats Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-6 flex items-center space-x-6 text-sm text-muted-foreground"
                    >
                        <div className="flex items-center space-x-2">
                            <div className="p-1.5 bg-green-500/10 rounded-lg">
                                <FiCheckCircle className="w-4 h-4 text-green-500" />
                            </div>
                            <span>
    System Status:{" "}
    <span className={`font-medium ${
        systemStatus === "Operational" ? "text-green-500" :
        systemStatus === "Degraded" ? "text-yellow-500" :
        "text-red-500"
    }`}>
        {systemStatus}
    </span>
</span>

                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="p-1.5 bg-blue-500/10 rounded-lg">
                                <FiClock className="w-4 h-4 text-blue-500" />
                            </div>
                            <span>Last Updated: <span className="font-medium">{new Date().toLocaleTimeString()}</span></span>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-card rounded-2xl shadow-xl border border-border p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-500"
                >
                    {/* Enhanced background decorations */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-chart-3/5 rounded-full blur-2xl group-hover:bg-chart-3/10 transition-colors duration-500"></div>

                    <div className="relative">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center space-x-3">
                                <motion.div 
                                    whileHover={{ scale: 1.1, rotate: 180 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    className="p-2 bg-primary/10 rounded-lg"
                                >
                                    <FiCpu className="w-5 h-5 text-primary" />
                                </motion.div>
                                <h2 className="text-xl font-bold">System Health</h2>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl text-sm bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-all duration-300"
                            >
                                <FiRefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                                <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
                            </motion.button>
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
                    className="bg-card rounded-2xl shadow-xl border border-border p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-500"
                >
                    {/* Enhanced background decorations */}
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-chart-1/5 rounded-full blur-2xl group-hover:bg-chart-1/10 transition-colors duration-500"></div>
                    <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-chart-4/5 rounded-full blur-2xl group-hover:bg-chart-4/10 transition-colors duration-500"></div>

                    <div className="relative">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center space-x-3">
                                <motion.div 
                                    whileHover={{ scale: 1.1, rotate: 180 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    className="p-2 bg-primary/10 rounded-lg"
                                >
                                    <FiServer className="w-5 h-5 text-primary" />
                                </motion.div>
                                <h2 className="text-xl font-bold">Services Overview</h2>
                            </div>
                            <Link href="/services">
                                <motion.div
                                    whileHover={{ scale: 1.05, x: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80 transition-colors duration-200"
                                >
                                    <span className="font-medium">View all</span>
                                    <FiArrowRight className="w-4 h-4" />
                                </motion.div>
                            </Link>
                        </div>

                        <AnimatePresence mode="wait">
                            {servicesLoading ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex justify-center items-center h-[300px]"
                                >
                                    <div className="relative">
                                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <FiServer className="w-5 h-5 text-primary animate-pulse" />
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-5"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl p-5 text-center border border-green-500/20 relative overflow-hidden group hover:shadow-lg transition-all duration-300"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-500/5 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                            <motion.div 
                                                className="relative"
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                <div className="flex justify-center mb-2">
                                                    <div className="p-2 bg-green-500/20 rounded-lg">
                                                        <FiZap className="w-5 h-5 text-green-500" />
                                                    </div>
                                                </div>
                                                <motion.p 
                                                    className="text-green-500 text-3xl font-bold mb-1"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                                >
                                                    {runningServices}
                                                </motion.p>
                                                <p className="text-sm font-medium text-green-600/80">
                                                    Running Services
                                                </p>
                                            </motion.div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.4 }}
                                            className="bg-gradient-to-br from-red-500/10 to-red-500/5 rounded-xl p-5 text-center border border-red-500/20 relative overflow-hidden group hover:shadow-lg transition-all duration-300"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-500/5 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                            <motion.div 
                                                className="relative"
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                <div className="flex justify-center mb-2">
                                                    <div className="p-2 bg-red-500/20 rounded-lg">
                                                        <FiXCircle className="w-5 h-5 text-red-500" />
                                                    </div>
                                                </div>
                                                <motion.p 
                                                    className="text-red-500 text-3xl font-bold mb-1"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                                >
                                                    {stoppedServices}
                                                </motion.p>
                                                <p className="text-sm font-medium text-red-600/80">
                                                    Stopped Services
                                                </p>
                                            </motion.div>
                                        </motion.div>
                                    </div>

                                    <div className="space-y-3 mt-5">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                                                <FiLayers className="w-4 h-4" />
                                                <span>Recent Services</span>
                                            </h3>
                                        </div>
                                        {services.slice(0, 3).map((service, index) => (
                                            <motion.div
                                                key={service.name}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 + index * 0.1 }}
                                                className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border hover:border-primary/30 hover:bg-background/80 transition-all duration-200 group"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className={`relative w-2.5 h-2.5`}>
                                                        <div className={`absolute inset-0 rounded-full ${
                                                            service.isActive
                                                                ? "bg-green-500"
                                                                : "bg-red-500"
                                                        } animate-ping opacity-75`}></div>
                                                        <div className={`relative rounded-full w-2.5 h-2.5 ${
                                                            service.isActive
                                                                ? "bg-green-500"
                                                                : "bg-red-500"
                                                        }`}></div>
                                                    </div>
                                                    <span className="font-medium group-hover:text-primary transition-colors duration-200">
                                                        {service.displayName}
                                                    </span>
                                                </div>
                                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                                                    service.isActive
                                                        ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                                        : "bg-red-500/10 text-red-500 border border-red-500/20"
                                                }`}>
                                                    {service.isActive ? "running" : "stopped"}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}