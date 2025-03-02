"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    FiPlay,
    FiSquare,
    FiAlertCircle,
    FiCheckCircle,
    FiXCircle,
    FiFileText,
} from "react-icons/fi";
import { Service } from "@/types";
import { startService, stopService } from "@/utils/api";
import { isAdmin } from "@/utils/auth";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface ServiceCardProps {
    service: Service;
    onStatusChange: () => void;
}

export default function ServiceCard({
    service,
    onStatusChange,
}: ServiceCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const admin = isAdmin();

    const handleStartService = async () => {
        if (!admin) {
            toast.error("You need admin privileges to perform this action");
            return;
        }

        setIsLoading(true);
        try {
            await startService(service.Name);
            toast.success(`${service.DisplayName} started successfully`);
            onStatusChange();
        } catch (error) {
            console.error("Failed to start service:", error);
            toast.error(`Failed to start ${service.DisplayName}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStopService = async () => {
        if (!admin) {
            toast.error("You need admin privileges to perform this action");
            return;
        }

        setIsLoading(true);
        try {
            await stopService(service.Name);
            toast.success(`${service.DisplayName} stopped successfully`);
            onStatusChange();
        } catch (error) {
            console.error("Failed to stop service:", error);
            toast.error(`Failed to stop ${service.DisplayName}`);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = () => {
        switch (service.status) {
            case "running":
                return <FiCheckCircle className="w-5 h-5 text-green-500" />;
            case "stopped":
                return <FiXCircle className="w-5 h-5 text-red-500" />;
            default:
                return <FiAlertCircle className="w-5 h-5 text-yellow-500" />;
        }
    };

    const getStatusBadgeClass = () => {
        switch (service.status) {
            case "running":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case "stopped":
                return "bg-red-500/10 text-red-500 border-red-500/20";
            default:
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border relative group"
        >
            {/* Status indicator line at top */}
            <div
                className={`h-1 w-full ${
                    service.status === "running"
                        ? "bg-green-500"
                        : service.status === "stopped"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                }`}
            ></div>

            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-semibold mb-1 flex items-center">
                            {service.DisplayName}
                            <motion.span
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className={`ml-3 text-xs px-2.5 py-1 rounded-full inline-flex items-center ${getStatusBadgeClass()} border`}
                            >
                                {getStatusIcon()}
                                <span className="ml-1.5 font-medium capitalize">
                                    {service.status}
                                </span>
                            </motion.span>
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            {service.Name}
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <div className="flex space-x-2">
                        {admin && (
                            <>
                                <motion.button
                                    whileHover={{
                                        scale: 1.05,
                                        backgroundColor:
                                            "rgba(34, 197, 94, 0.2)",
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={
                                        service.status === "running" ||
                                        isLoading
                                    }
                                    onClick={handleStartService}
                                    className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        service.status === "running" ||
                                        isLoading
                                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                                            : "bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20"
                                    }`}
                                >
                                    {isLoading &&
                                    service.status !== "running" ? (
                                        "Loading..."
                                    ) : (
                                        <FiPlay className="w-4 h-4" />
                                    )}
                                    <span>Start</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{
                                        scale: 1.05,
                                        backgroundColor:
                                            "rgba(239, 68, 68, 0.2)",
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={
                                        service.status !== "running" ||
                                        isLoading
                                    }
                                    onClick={handleStopService}
                                    className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        service.status !== "running" ||
                                        isLoading
                                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                                            : "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
                                    }`}
                                >
                                    {isLoading &&
                                    service.status === "running" ? (
                                        "Loading..."
                                    ) : (
                                        <FiSquare className="w-4 h-4" />
                                    )}
                                    <span>Stop</span>
                                </motion.button>
                            </>
                        )}
                    </div>

                    <Link href={`/services/${service.Name}/logs`}>
                        <motion.div
                            whileHover={{
                                scale: 1.05,
                                backgroundColor: "rgba(var(--primary), 0.2)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-all duration-200"
                        >
                            <FiFileText className="w-4 h-4" />
                            <span>Logs</span>
                        </motion.div>
                    </Link>
                </div>
            </div>

            {/* Hover effect glow */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                    boxShadow: isHovered
                        ? `0 0 0 2px rgba(var(--primary), 0.3), 
               0 20px 25px -5px rgba(0, 0, 0, 0.1), 
               0 10px 10px -5px rgba(0, 0, 0, 0.04)`
                        : "none",
                }}
                transition={{ duration: 0.2 }}
            />
        </motion.div>
    );
}
