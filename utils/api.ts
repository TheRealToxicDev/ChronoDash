import axios from "axios";
import Cookies from "js-cookie";
import {
    HealthStatus,
    LoginRequest,
    LoginResponse,
    ServicesResponse,
    ServiceStatusResponse,
    ServiceActionResponse,
    ServiceLogsResponse,
} from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = Cookies.get("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Health endpoints
export const getHealth = () => api.get<HealthStatus>("/health");

// Auth endpoints
export const login = (data: LoginRequest) =>
    api.post<LoginResponse>("/auth/login", data);

// Service endpoints
export const getServices = () => api.get<ServicesResponse>("/services");

export const getServiceStatus = (name: string) =>
    api.get<ServiceStatusResponse>(`/services/status/${name}`);

export const startService = (name: string) =>
    api.post<ServiceActionResponse>(`/services/start/${name}`);

export const stopService = (name: string) =>
    api.post<ServiceActionResponse>(`/services/stop/${name}`);

export const getServiceLogs = (
    name: string,
    lines?: number,
    since?: string
) => {
    let url = `/services/logs/${name}`;
    const params = new URLSearchParams();

    if (lines) params.append("lines", lines.toString());
    if (since) params.append("since", since);

    if (params.toString()) {
        url += `?${params.toString()}`;
    }

    return api.get<ServiceLogsResponse>(url);
};

export default api;
