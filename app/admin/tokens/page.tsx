"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";
import { 
  FiKey, 
  FiRefreshCw, 
  FiTrash2, 
  FiUser, 
  FiClock,
  FiAlertCircle,
  FiSearch,
  FiFilter,
  FiShield,
  FiCpu,
  FiActivity,
  FiLock
} from "react-icons/fi";
import { Token } from "@/types";
import { getAllTokens, revokeUserTokens, getUserTokensByAdmin } from "@/utils/api";
import { isAdmin } from "@/utils/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminTokensPage() {
  const router = useRouter();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [userFilter, setUserFilter] = useState<string>("");
  const [revoking, setRevoking] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTokens = async () => {
    setLoading(true);
    setIsRefreshing(true);
    try {
      let response;
      if (selectedUser) {
        response = await getUserTokensByAdmin(selectedUser);
      } else {
        response = await getAllTokens();
      }
      setTokens(response.data.data);
      setError(null);
      toast.success("Tokens refreshed successfully");
    } catch (err: any) {
      console.error("Failed to fetch tokens:", err);
      const errorMessage = err.response?.data?.message || "Failed to load tokens";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!isAdmin()) {
      toast.error("Unauthorized access");
      router.push("/");
      return;
    }
    fetchTokens();
  }, [selectedUser]);

  const handleRevokeUserTokens = async (userId: string) => {
    if (!confirm(`Are you sure you want to revoke all tokens for user ${userId}?`)) {
      return;
    }

    setRevoking(true);
    try {
      await revokeUserTokens({ userId });
      await fetchTokens();
      toast.success(`Successfully revoked all tokens for user ${userId}`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to revoke tokens";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setRevoking(false);
    }
  };

  const uniqueUsers = [...new Set(tokens.map(token => token.userId))];
  const filteredTokens = tokens.filter(token => 
    token.userId.toLowerCase().includes(userFilter.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section with Premium Styling */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 relative"
      >
        {/* Decorative background elements */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative">
          <div className="flex items-center space-x-3 mb-2">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1
              }}
              className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl shadow-xl"
            >
              <FiKey className="w-8 h-8 text-primary" />
            </motion.div>
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent"
              >
                Token Management
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground/80 mt-1"
              >
                Secure and monitor authentication tokens across your system
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid with Enhanced Visual Design */}
      <div className="grid gap-6 mb-8 md:grid-cols-3">
        {[
          {
            icon: <FiKey className="w-7 h-7" />,
            value: tokens.length,
            label: "Active Tokens",
            sublabel: "Total active sessions",
            color: "blue",
            delay: 0.1
          },
          {
            icon: <FiUser className="w-7 h-7" />,
            value: uniqueUsers.length,
            label: "Unique Users",
            sublabel: "With active sessions",
            color: "green",
            delay: 0.2
          },
          {
            icon: <FiShield className="w-7 h-7" />,
            value: tokens.reduce((acc, token) => acc + token.roles.length, 0),
            label: "Active Roles",
            sublabel: "Total assignments",
            color: "purple",
            delay: 0.3
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.delay }}
            className={`bg-gradient-to-br from-${stat.color}-500/5 via-${stat.color}-500/10 to-transparent backdrop-blur-xl rounded-2xl border border-${stat.color}-500/20 p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-500`}
          >
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            
            {/* Decorative circles */}
            <div className={`absolute -top-12 -right-12 w-32 h-32 bg-${stat.color}-500/10 rounded-full blur-2xl group-hover:bg-${stat.color}-500/20 transition-colors duration-500`}></div>
            <div className={`absolute -bottom-12 -left-12 w-32 h-32 bg-${stat.color}-500/10 rounded-full blur-2xl group-hover:bg-${stat.color}-500/20 transition-colors duration-500`}></div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: stat.delay + 0.1 }}
                  className={`p-3 bg-${stat.color}-500/10 rounded-xl border border-${stat.color}-500/20 shadow-inner`}
                >
                  {stat.icon}
                </motion.div>
                <motion.span 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: stat.delay + 0.2 }}
                  className={`text-4xl font-bold text-${stat.color}-500`}
                >
                  {stat.value}
                </motion.span>
              </div>
              <motion.h3 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stat.delay + 0.3 }}
                className="text-lg font-semibold mb-1"
              >
                {stat.label}
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stat.delay + 0.4 }}
                className="text-sm text-muted-foreground"
              >
                {stat.sublabel}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Card with Enhanced Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-xl rounded-2xl border border-border/50 overflow-hidden relative shadow-xl"
      >
        {/* Decorative background elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-2xl"></div>
        
        <div className="relative">
          {/* Controls Section */}
          <div className="p-6 border-b border-border/50 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <FiSearch className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Filter by user ID..."
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                    className="pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-input focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200 w-full sm:w-64 placeholder:text-muted-foreground/50"
                  />
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <FiFilter className="w-5 h-5" />
                  </div>
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-input focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="">All Users</option>
                    {uniqueUsers.map(user => (
                      <option key={user} value={user}>{user}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={fetchTokens}
                disabled={isRefreshing}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-primary/5"
              >
                <FiRefreshCw className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} />
                <span className="font-medium">{isRefreshing ? "Refreshing..." : "Refresh"}</span>
              </motion.button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-destructive/10 border-b border-destructive/20 backdrop-blur-sm"
            >
              <div className="flex items-center space-x-2 text-destructive">
                <FiAlertCircle className="w-5 h-5" />
                <p className="font-medium">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30 backdrop-blur-sm">
                  <th className="px-6 py-4 text-left text-sm font-medium">Token ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">User</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Roles</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Issued</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Expires</th>
                  <th className="px-6 py-4 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <AnimatePresence mode="wait">
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <motion.tr
                        key={`skeleton-${i}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="animate-pulse backdrop-blur-sm"
                      >
                        <td className="px-6 py-4"><div className="h-4 bg-muted rounded-full w-24"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-muted rounded-full w-20"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-muted rounded-full w-16"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-muted rounded-full w-32"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-muted rounded-full w-32"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-muted rounded-full w-20 ml-auto"></div></td>
                      </motion.tr>
                    ))
                  ) : filteredTokens.length > 0 ? (
                    filteredTokens.map((token, index) => (
                      <motion.tr
                        key={token.tokenId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-muted/30 group backdrop-blur-sm"
                      >
                        <td className="px-6 py-4">
                          <div className="font-mono text-sm bg-primary/5 px-4 py-2 rounded-xl border border-primary/20 shadow-inner w-fit group-hover:bg-primary/10 transition-colors duration-200">
                            {token.tokenId}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-500/10 rounded-xl border border-green-500/20 shadow-inner">
                              <FiUser className="w-4 h-4 text-green-500" />
                            </div>
                            <span className="font-medium">{token.userId}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 flex-wrap">
                            {token.roles.map(role => (
                              <span
                                key={role}
                                className="px-3 py-1.5 text-xs rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20 font-medium shadow-inner flex items-center space-x-1"
                              >
                                <FiShield className="w-3 h-3" />
                                <span>{role}</span>
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 shadow-inner">
                              <FiClock className="w-4 h-4 text-blue-500" />
                            </div>
                            <span className="text-sm" title={format(new Date(token.issuedAt), 'PPpp')}>
                              {formatDistanceToNow(new Date(token.issuedAt), { addSuffix: true })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 shadow-inner">
                              <FiClock className="w-4 h-4 text-amber-500" />
                            </div>
                            <span className="text-sm" title={format(new Date(token.expiresAt), 'PPpp')}>
                              {formatDistanceToNow(new Date(token.expiresAt), { addSuffix: true })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRevokeUserTokens(token.userId)}
                              disabled={revoking}
                              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 transition-all duration-200 shadow-lg shadow-destructive/5"
                            >
                              <FiTrash2 className="w-4 h-4" />
                              <span className="font-medium">Revoke All</span>
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col items-center justify-center space-y-4"
                        >
                          <div className="p-4 bg-muted/30 rounded-full border border-border/50 shadow-inner">
                            <FiKey className="w-10 h-10 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-xl font-medium text-muted-foreground">No tokens found</p>
                            <p className="text-sm text-muted-foreground/70 mt-1">
                              {userFilter ? "Try adjusting your search filter" : "No active tokens in the system"}
                            </p>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}