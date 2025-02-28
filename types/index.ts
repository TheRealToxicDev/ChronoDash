export interface HealthStatus {
  status: string;
  uptime: string;
  version: string;
  goVersion: string;
  memory: {
    alloc: number;
    totalAlloc: number;
    sys: number;
    numGC: number;
    heapInUse: number;
  };
  startTime: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    roles: string[];
  };
}

export interface ErrorResponse {
  status: string;
  message: string;
  code: number;
}

export interface Service {
  DisplayName: string;
  Name: string;
  status: 'running' | 'stopped' | 'unknown';
}

export interface ServicesResponse {
  success: boolean;
  message: string;
  data: Service[];
}

export interface ServiceStatusResponse {
  success: boolean;
  message: string;
  data: Service;
}

export interface ServiceActionResponse {
  success: boolean;
  message: string;
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
}

export interface ServiceLogsResponse {
  status: string;
  data: {
    logs: LogEntry[];
  };
}

export interface User {
  username: string;
  roles: string[];
}