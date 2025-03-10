"use client";

import { motion } from "framer-motion";
import { HealthStatus } from "@/types";
import { formatDistanceToNow } from "date-fns";
import {
    FiHardDrive,
    FiClock,
    FiActivity,
    FiTrendingUp,
} from "react-icons/fi";

interface HealthStatsProps {
    health: HealthStatus | null;
    loading: boolean;
    error: string | null;
}

export default function HealthStats({
    health,
    loading,
    error,
}: HealthStatsProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-background/50 rounded-xl p-4 animate-pulse border border-border/50"
                    >
                        <div className="h-4 w-1/3 bg-muted rounded mb-2"></div>
                        <div className="h-6 w-1/2 bg-muted rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-destructive/10 text-destructive p-5 rounded-xl border border-destructive/20">
                <p className="font-medium">{error}</p>
            </div>
        );
    }

    if (!health) {
        return (
            <div className="text-center p-6 bg-background/50 rounded-xl border border-border/50">
                <p className="text-muted-foreground">
                    No health data available
                </p>
            </div>
        );
    }

    const formatMemory = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        if (bytes < 1024 * 1024 * 1024)
            return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    };

    const formatUptime = (uptime: string) => {
        try {
            return formatDistanceToNow(new Date(health.startTime), {
                addSuffix: false,
            });
        } catch (e) {
            return uptime || "Unknown";
        }
    };

    const getStatusColor = (status: string) => {
        if (status === "healthy")
            return "text-green-500 bg-green-500/10 border-green-500/20";
        if (status === "degraded")
            return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
        return "text-red-500 bg-red-500/10 border-red-500/20";
    };

    const stats = [
        {
            icon: <FiActivity className="w-5 h-5 text-chart-1" />,
            label: "Status",
            value: health.status || "Unknown",
            color: getStatusColor(health.status),
            gradient: "from-chart-1/20 to-chart-1/5",
        },
        {
            icon: <FiClock className="w-5 h-5 text-chart-2" />,
            label: "Uptime",
            value: formatUptime(health.uptime),
            color: "text-foreground bg-chart-2/10 border-chart-2/20",
            gradient: "from-chart-2/20 to-chart-2/5",
        },
        {
            icon: <FiTrendingUp className="w-5 h-5 text-chart-3" />,
            label: "Version",
            value: health.version || "Unknown",
            color: "text-foreground bg-chart-3/10 border-chart-3/20",
            gradient: "from-chart-3/20 to-chart-3/5",
        },
        {
            icon: <FiHardDrive className="w-5 h-5 text-chart-4" />,
            label: "Memory Usage",
            value: formatMemory(health.memory?.heapInUse || 0),
            color: "text-foreground bg-chart-4/10 border-chart-4/20",
            gradient: "from-chart-4/20 to-chart-4/5",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{
                        y: -5,
                        boxShadow:
                            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                    }}
                    className={`rounded-xl p-4 border relative overflow-hidden transition-all duration-300 ${stat.color}`}
                >
                    {/* Background gradient */}
                    <div
                        className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-30`}
                    ></div>

                    <div className="relative">
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="p-1.5 bg-background/30 backdrop-blur-sm rounded-lg">
                                {stat.icon}
                            </div>
                            <span className="text-xs font-medium">
                                {stat.label}
                            </span>
                        </div>
                        <p className="text-lg font-semibold">{stat.value}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
