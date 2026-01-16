
export enum AlertSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export interface SecurityAlert {
  id: string;
  timestamp: string;
  source: string;
  category: 'Network' | 'Endpoint' | 'Access' | 'System';
  message: string;
  severity: AlertSeverity;
  status: 'Open' | 'Resolved' | 'Investigating';
}

export interface Endpoint {
  id: string;
  hostname: string;
  ip: string;
  os: string;
  lastSeen: string;
  status: 'Online' | 'Offline' | 'Compromised';
  avStatus: 'Active' | 'Disabled' | 'Outdated';
  firewall: boolean;
  cpuUsage: number;
  memoryUsage: number;
  openPorts: number[];
}

export interface NetworkStats {
  inbound: number;
  outbound: number;
  latency: number;
  activeConnections: number;
  threatsBlocked: number;
}
