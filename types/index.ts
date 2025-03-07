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
    status: string;  // Changed from 'success' boolean to 'status' string
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
    displayName: string;
    name: string;
    isActive: boolean;
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

export interface LogEntryType {
    Level: string;
    Message: string;
    Time: {
        DateTime: string;
        value: string;
    };
}

export interface ServiceLogsResponse {
    success: boolean;
    message: string;
    data: LogEntry[];
}

export interface User {
    username: string;
    roles: string[];
}

export interface Token {
    tokenId: string;
    userId: string;
    roles: string[];
    issuedAt: string;
    expiresAt: string;
  }
  
  export interface TokenResponse {
    status: string;
    message: string;
    data: Token[];
  }
  
  export interface SingleTokenResponse {
    status: string;
    message: string;
    data: {
      token: string;
    };
  }
  
  export interface RevokeTokenRequest {
    tokenId: string;
  }
  
  export interface AdminRevokeRequest {
    userId: string;
  }
  
  export interface GenericResponse {
    status: string;
    message: string;
    data?: any;
  }