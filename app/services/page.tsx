"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiServer, FiRefreshCw } from "react-icons/fi";
import ServiceCard from "@/components/cards/ServiceCard";
import { Service } from "@/types";
import { getServices } from "@/utils/api";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await getServices();
      const servicesData = response.data?.data ?? []; // ✅ FIXED: Directly use data array
      setServices(servicesData);
    } catch (err) {
      console.error("Failed to fetch services:", err);
      setError("Failed to load services. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <FiServer className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold">Services</h1>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchServices}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </motion.button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}

      {loading && !error ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-card rounded-xl shadow-lg overflow-hidden border border-border animate-pulse"
            >
              <div className="p-6">
                <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3 mb-6"></div>
                <div className="flex justify-between">
                  <div className="h-8 bg-muted rounded w-1/4"></div>
                  <div className="h-8 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(services) && services.length > 0 ? (
            services.map((service) => (
              <ServiceCard
                key={service.Name}
                service={service}
                onStatusChange={fetchServices}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No services found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
