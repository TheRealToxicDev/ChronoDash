"use client";

import { useEffect, useState } from "react";
import { FiActivity } from "react-icons/fi";
import HealthStats from "@/components/cards/HealthStatsCard";
import { getHealth } from "@/utils/api";
import { HealthStatus } from "@/types";

export default function Home() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await getHealth();
        setHealth(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch health data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-2">
          <FiActivity className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold">System Dashboard</h1>
        </div>
        <p className="text-muted-foreground">
          Monitor system health and manage services from a single dashboard
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Health Overview</h2>
        <HealthStats health={health} loading={loading} error={error} />
      </section>
    </div>
  );
}
