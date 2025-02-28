"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { FiCpu, FiClock, FiPackage, FiActivity } from "react-icons/fi";
import { HealthStatus } from "@/types";

interface HealthStatsProps {
  health: HealthStatus | null;
  loading: boolean;
  error: string | null;
}

export default function HealthStats({ health, loading, error }: HealthStatsProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !health) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
        <p>{error || "Failed to load health data"}</p>
      </div>
    );
  }

  const formatMemory = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy HH:mm:ss");
    } catch (error) {
      return dateString;
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      <motion.div variants={item} className="bg-card rounded-xl shadow-md p-6 border border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-green-500/10 rounded-full">
            <FiActivity className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-lg font-medium">Status</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${health.status === "healthy" ? "bg-green-500" : "bg-red-500"}`}></div>
          <p className="text-2xl font-semibold capitalize">{health.status}</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-card rounded-xl shadow-md p-6 border border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-500/10 rounded-full">
            <FiClock className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium">Uptime</h3>
        </div>
        <p className="text-2xl font-semibold">{health.uptime}</p>
        <p className="text-xs text-muted-foreground mt-2">Started: {formatDate(health.startTime)}</p>
      </motion.div>

      <motion.div variants={item} className="bg-card rounded-xl shadow-md p-6 border border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-purple-500/10 rounded-full">
            <FiPackage className="w-5 h-5 text-purple-500" />
          </div>
          <h3 className="text-lg font-medium">Version</h3>
        </div>
        <p className="text-2xl font-semibold">{health.version}</p>
        <p className="text-xs text-muted-foreground mt-2">{health.goVersion}</p>
      </motion.div>

      <motion.div variants={item} className="bg-card rounded-xl shadow-md p-6 border border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-orange-500/10 rounded-full">
            <FiCpu className="w-5 h-5 text-orange-500" />
          </div>
          <h3 className="text-lg font-medium">Memory</h3>
        </div>
        <p className="text-2xl font-semibold">{formatMemory(health.memory.alloc)}</p>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <p className="text-xs text-muted-foreground">Heap</p>
            <p className="text-sm">{health.memory.heapInUse} MB</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">GC Cycles</p>
            <p className="text-sm">{health.memory.numGC}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
