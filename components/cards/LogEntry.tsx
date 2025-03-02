"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { LogEntryType as LogEntryType } from "@/types";

interface LogEntryProps {
    log: LogEntryType;
    index: number;
}

export default function LogEntry({ log, index }: LogEntryProps) {
    const getLevelColor = (level?: string) => {
        if (!level) return "bg-muted text-muted-foreground border-border";

        switch (level.toLowerCase()) {
            case "error":
                return "bg-red-500/10 text-red-500 border-red-500/20";
            case "warn":
            case "warning":
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "info":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "debug":
                return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            default:
                return "bg-muted text-muted-foreground border-border";
        }
    };

    const formatTimestamp = (timestamp: string) => {
        try {
            // Convert "28 February 2025 11:46:12" to Date object
            return format(
                new Date(timestamp.replace(/(\d+)(?:st|nd|rd|th)/, "$1")),
                "MMM dd, yyyy HH:mm:ss"
            );
        } catch (error) {
            return timestamp;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
            className={`p-3 rounded-md border mb-2 ${getLevelColor(log.Level)}`}
        >
            <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase">
                        {log.Level}
                    </span>
                    <span className="text-xs">
                        {formatTimestamp(log.Time?.DateTime || "Unknown date")}
                    </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{log.Message}</p>
            </div>
        </motion.div>
    );
}
