"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    FiServer,
    FiRefreshCw,
    FiSearch,
    FiFilter,
    FiGrid,
    FiList,
} from "react-icons/fi";
import ServiceCard from "@/components/cards/ServiceCard";
import { Service } from "@/types";
import { getServices } from "@/utils/api";
import toast from "react-hot-toast";

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setIsRefreshing(true);
        setError(null);
        try {
            const response = await getServices();
            const servicesData = response.data?.data ?? [];

            setServices(
                servicesData.map((service: any) => ({
                    displayName: service.displayName,
                    name: service.name,
                    isActive: service.isActive,
                }))
            );
        } catch (err) {
            console.error("Failed to fetch services:", err);
            setError("Failed to load services. Please try again.");
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleRefresh = () => {
        fetchServices();
        toast.success("Services refreshed");
    };

    const filteredServices = useMemo(() => {
        return services.filter(
            (service) =>
                (service.displayName.toLowerCase().includes( 
                    searchQuery.toLowerCase()
                ) ||
                service.name.toLowerCase().includes( 
                    searchQuery.toLowerCase()
                )) &&
                (statusFilter === "all" || 
                 (statusFilter === "running" && service.isActive) ||
                 (statusFilter === "stopped" && !service.isActive))
        );
    }, [services, searchQuery, statusFilter]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
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
                            <FiServer className="w-10 h-10 text-primary" />
                        </motion.div>
                        <div>
                            <motion.h1 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-5xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent tracking-tight"
                            >
                                Services
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-lg text-muted-foreground/80 mt-2"
                            >
                                Manage and monitor all your system services
                            </motion.p>
                        </div>
                    </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
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

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card rounded-2xl shadow-lg border p-5 mb-8">
                <div className="relative flex-grow">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search services..."
                        className="w-full pl-12 py-3 bg-background border border-input rounded-xl focus:ring-primary/30 focus:border-primary/50"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="py-3 px-4 rounded-xl border border-input focus:ring-primary/30"
                >
                    <option value="all">All Status</option>
                    <option value="running">Running</option>
                    <option value="stopped">Stopped</option>
                </select>

                <div className="flex items-center space-x-1 bg-background rounded-xl border border-input p-1">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-lg ${
                            viewMode === "grid"
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted/50"
                        }`}
                    >
                        <FiGrid className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-lg ${
                            viewMode === "list"
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted/50"
                        }`}
                    >
                        <FiList className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-destructive/10 text-destructive p-5 rounded-xl mb-6 border">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-card rounded-2xl h-28 border border-border"
                        ></div>
                    ))}
                </div>
            ) : filteredServices.length > 0 ? (
                <div
                    className={`grid gap-6 ${
                        viewMode === "grid"
                            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                            : "grid-cols-1"
                    }`}
                >
                    {filteredServices.map((service) => (
                        <ServiceCard
                            key={service.name}
                            service={service}
                            onStatusChange={fetchServices}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-card rounded-2xl border border-border">
                    <FiServer className="w-8 h-8 text-muted-foreground mx-auto" />
                    <p className="text-lg font-medium text-muted-foreground">
                        No services found
                    </p>
                </div>
            )}
        </div>
    );
}