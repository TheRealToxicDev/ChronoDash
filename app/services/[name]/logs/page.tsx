"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiArrowLeft, FiFileText, FiRefreshCw } from "react-icons/fi";
import { getServiceLogs } from "@/utils/api";
import { LogEntryType } from "@/types";
import LogEntrys from "@/components/cards/LogEntry";

export default function ServiceLogsPage() {
  const params = useParams();
  const router = useRouter();
  const serviceName = params.name as string;
  const [logs, setLogs] = useState<LogEntryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lines, setLines] = useState(100);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await getServiceLogs(serviceName, lines);
      const servicesData = response.data?.data ?? [];

      setLogs(servicesData as unknown as LogEntryType[]);

      setError(null);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
      setError("Failed to load service logs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (serviceName) {
      fetchLogs();
    }
  }, [serviceName, lines]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-1 text-muted-foreground hover:text-primary mb-4"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to services</span>
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FiFileText className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold">{serviceName} Logs</h1>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={lines}
              onChange={(e) => setLines(Number(e.target.value))}
              className="bg-background border border-input rounded-md px-3 py-1.5 text-sm"
            >
              <option value={50}>Last 50 lines</option>
              <option value={100}>Last 100 lines</option>
              <option value={200}>Last 200 lines</option>
              <option value={500}>Last 500 lines</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchLogs}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </motion.button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-card rounded-xl shadow-lg border border-border p-6">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="p-3 rounded-md border border-border animate-pulse">
                <div className="flex justify-between mb-2">
                  <div className="h-4 bg-muted rounded w-16"></div>
                  <div className="h-4 bg-muted rounded w-32"></div>
                </div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : logs.length > 0 ? (
          <div className="space-y-2">
            {logs.map((log, index) => (
              <LogEntrys key={index} log={log} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No logs available</p>
          </div>
        )}
      </div>
    </div>
  );
}
