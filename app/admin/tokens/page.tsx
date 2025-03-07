"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";
import { 
  FiKey, 
  FiRefreshCw, 
  FiTrash2, 
  FiUser, 
  FiClock,
  FiShield,
  FiAlertCircle 
} from "react-icons/fi";
import { Token, GenericResponse } from "@/types";
import { getAllTokens, revokeUserTokens, getUserTokensByAdmin } from "@/utils/api";
import { isAdmin } from "@/utils/auth";
import { useRouter } from "next/navigation";

export default function AdminTokensPage() {
  const router = useRouter();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [userFilter, setUserFilter] = useState<string>("");
  const [revoking, setRevoking] = useState(false);

  const fetchTokens = async () => {
    setLoading(true);
    try {
      let response;
      if (selectedUser) {
        response = await getUserTokensByAdmin(selectedUser);
      } else {
        response = await getAllTokens();
      }
      setTokens(response.data.data);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch tokens:", err);
      setError(err.response?.data?.message || "Failed to load tokens");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin()) {
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
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to revoke tokens");
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
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-2">
          <FiKey className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold">Token Management</h1>
        </div>
        <p className="text-muted-foreground">
          Manage and monitor all active authentication tokens
        </p>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-4">
        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/10 rounded-full">
              <FiKey className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-2xl font-bold">{tokens.length}</span>
          </div>
          <h3 className="text-lg font-medium">Active Tokens</h3>
          <p className="text-sm text-muted-foreground">Total active sessions</p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/10 rounded-full">
              <FiUser className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-2xl font-bold">{uniqueUsers.length}</span>
          </div>
          <h3 className="text-lg font-medium">Unique Users</h3>
          <p className="text-sm text-muted-foreground">Users with active sessions</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Filter by user ID..."
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="px-4 py-2 rounded-md bg-background border border-input"
              />
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="px-4 py-2 rounded-md bg-background border border-input"
              >
                <option value="">All Users</option>
                {uniqueUsers.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchTokens}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </motion.button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive">
            <div className="flex items-center space-x-2">
              <FiAlertCircle className="w-4 h-4" />
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-sm font-medium">Token ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium">User</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Roles</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Issued</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Expires</th>
                <th className="px-6 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-20 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredTokens.length > 0 ? (
                filteredTokens.map((token) => (
                  <tr key={token.tokenId} className="hover:bg-muted/50">
                    <td className="px-6 py-4 font-mono text-sm">{token.tokenId}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <FiUser className="w-4 h-4 text-muted-foreground" />
                        <span>{token.userId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {token.roles.map(role => (
                          <span
                            key={role}
                            className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <FiClock className="w-4 h-4 text-muted-foreground" />
                        <span title={format(new Date(token.issuedAt), 'PPpp')}>
                          {formatDistanceToNow(new Date(token.issuedAt), { addSuffix: true })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <FiClock className="w-4 h-4 text-muted-foreground" />
                        <span title={format(new Date(token.expiresAt), 'PPpp')}>
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
                          className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm bg-destructive/10 text-destructive hover:bg-destructive/20"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          <span>Revoke All</span>
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No tokens found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}