"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { 
  FiPlay, 
  FiSquare, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiXCircle,
  FiFileText
} from "react-icons/fi";
import { Service } from "@/types";
import { startService, stopService } from "@/utils/api";
import { isAdmin } from "@/utils/auth";
import Link from "next/link";

interface ServiceCardProps {
  service: Service;
  onStatusChange: () => void;
}

export default function ServiceCard({ service, onStatusChange }: ServiceCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const admin = isAdmin();

  const handleStartService = async () => {
    if (!admin) return;

    setIsLoading(true);
    try {
      await startService(service.Name);
      onStatusChange();
    } catch (error) {
      console.error("Failed to start service:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopService = async () => {
    if (!admin) return;

    setIsLoading(true);
    try {
      await stopService(service.Name);
      onStatusChange();
    } catch (error) {
      console.error("Failed to stop service:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (service.status) {
      case 'running':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'stopped':
        return <FiXCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FiAlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-card rounded-xl shadow-lg overflow-hidden border border-border"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold">{service.DisplayName}</h3>
          <div className="flex items-center space-x-1">
            {getStatusIcon()}
            <span className={`text-sm capitalize ${
              service.status === 'running'
                ? 'text-green-500'
                : service.status === 'stopped'
                ? 'text-red-500'
                : 'text-yellow-500'
            }`}>
              {service.status}
            </span>
          </div>
        </div>

        <p className="text-muted-foreground mb-6">{service.Name}</p>

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {admin && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={service.status === 'running' || isLoading}
                  onClick={handleStartService}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm ${
                    service.status === 'running' || isLoading
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                  }`}
                >
                  <FiPlay className="w-4 h-4" />
                  <span>Start</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={service.status !== 'running' || isLoading}
                  onClick={handleStopService}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm ${
                    service.status !== 'running' || isLoading
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                  }`}
                >
                  <FiSquare className="w-4 h-4" />
                  <span>Stop</span>
                </motion.button>
              </>
            )}
          </div>

          <Link href={`/services/${service.Name}/logs`}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm bg-primary/10 text-primary hover:bg-primary/20"
            >
              <FiFileText className="w-4 h-4" />
              <span>Logs</span>
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
