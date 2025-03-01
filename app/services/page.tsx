"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiServer, FiRefreshCw, FiSearch, FiFilter, FiGrid, FiList } from "react-icons/fi";
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

  const fetchServices = async () => {
    setIsRefreshing(true);
    try {
      const response = await getServices();
      const servicesData = response.data?.data ?? [];
  
      const mappedServices: Service[] = servicesData.map((service: any) => ({
        DisplayName: service.DisplayName,
        Name: service.Name,
        status: mapServiceStatus(service.Status),
      }));
  
      setServices(mappedServices);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const mapServiceStatus = (status: number): 'running' | 'stopped' | 'unknown' => {
    switch (status) {
      case 1:
        return 'stopped';
      case 4:
        return 'running';
      default:
        return 'unknown';
    }
  };  

  useEffect(() => {
    fetchServices();
  }, []);

  const handleRefresh = () => {
    fetchServices();
    toast.success("Services refreshed");
  };

  const filteredServices = services
    .filter(service => 
      service.DisplayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.Name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(service => 
      statusFilter === "all" || service.status === statusFilter
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FiServer className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Services</h1>
          </div>
          <p className="text-muted-foreground">
            Manage and monitor all your system services
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-all duration-300 shadow-sm"
        >
          <FiRefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="font-medium">{isRefreshing ? "Refreshing..." : "Refresh"}</span>
        </motion.button>
      </div>
      
      <div className="bg-card rounded-2xl shadow-lg border border-border p-5 mb-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-chart-3/5 rounded-full blur-2xl"></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground">
              <FiSearch className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="w-full pl-11 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FiFilter className="w-5 h-5 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-background border border-input rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="running">Running</option>
                <option value="stopped">Stopped</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-1 bg-background rounded-xl border border-input p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid" 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list" 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <FiList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-destructive/10 text-destructive p-5 rounded-xl mb-6 border border-destructive/20">
          <p className="font-medium">{error}</p>
        </div>
      )}
      
      {loading && !error ? (
        <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}>
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border animate-pulse">
              <div className="h-1 w-full bg-muted"></div>
              <div className="p-6">
                <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3 mb-6"></div>
                <div className="flex justify-between">
                  <div className="h-10 bg-muted rounded w-1/4"></div>
                  <div className="h-10 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {filteredServices.length > 0 ? (
            <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}>
              {filteredServices.map((service) => (
                <ServiceCard key={service.Name} service={service} onStatusChange={fetchServices} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-muted/30 rounded-full">
                  <FiServer className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
              <p className="text-lg font-medium text-muted-foreground mb-2">No services found</p>
              <p className="text-sm text-muted-foreground/70">
                {searchQuery || statusFilter !== "all" 
                  ? "Try adjusting your search query or filter" 
                  : "No services are available in the system"}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}