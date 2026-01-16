
import { Endpoint, SecurityAlert, AlertSeverity } from './types';

export const MOCK_ENDPOINTS: Endpoint[] = [
  {
    id: 'EP-001',
    hostname: 'OFFICE-DSK-01',
    ip: '192.168.1.15',
    os: 'Windows 11 Pro',
    lastSeen: 'Just now',
    status: 'Online',
    avStatus: 'Active',
    firewall: true,
    cpuUsage: 12,
    memoryUsage: 45,
    openPorts: [80, 443, 3389]
  },
  {
    id: 'EP-002',
    hostname: 'OFFICE-DSK-02',
    ip: '192.168.1.18',
    os: 'Ubuntu 22.04',
    lastSeen: '2 mins ago',
    status: 'Online',
    avStatus: 'Active',
    firewall: true,
    cpuUsage: 8,
    memoryUsage: 22,
    openPorts: [22, 80]
  },
  {
    id: 'EP-003',
    hostname: 'OFFICE-MAC-01',
    ip: '192.168.1.25',
    os: 'macOS Sonoma',
    lastSeen: '5 mins ago',
    status: 'Compromised',
    avStatus: 'Disabled',
    firewall: false,
    cpuUsage: 98,
    memoryUsage: 88,
    openPorts: [445, 139, 4444]
  },
  {
    id: 'EP-004',
    hostname: 'RECEPTION-PC',
    ip: '192.168.1.40',
    os: 'Windows 10',
    lastSeen: '1 hour ago',
    status: 'Offline',
    avStatus: 'Outdated',
    firewall: true,
    cpuUsage: 0,
    memoryUsage: 0,
    openPorts: []
  }
];

export const MOCK_ALERTS: SecurityAlert[] = [
  {
    id: 'ALT-1001',
    timestamp: new Date().toISOString(),
    source: 'OFFICE-MAC-01',
    category: 'Endpoint',
    message: 'Unauthorized process "cryptominer.sh" detected and blocked.',
    severity: AlertSeverity.CRITICAL,
    status: 'Open'
  },
  {
    id: 'ALT-1002',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    source: 'Edge Firewall',
    category: 'Network',
    message: 'Multiple failed SSH login attempts from 185.x.x.x',
    severity: AlertSeverity.HIGH,
    status: 'Investigating'
  },
  {
    id: 'ALT-1003',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    source: 'System Backup',
    category: 'System',
    message: 'Storage capacity reaching 90% threshold on server cluster.',
    severity: AlertSeverity.LOW,
    status: 'Open'
  }
];
