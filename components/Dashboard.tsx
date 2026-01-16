
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Endpoint, SecurityAlert, AlertSeverity } from '../types';

interface DashboardProps {
  endpoints: Endpoint[];
  alerts: SecurityAlert[];
}

const data = [
  { time: '00:00', threats: 12, blocks: 45 },
  { time: '04:00', threats: 15, blocks: 38 },
  { time: '08:00', threats: 42, blocks: 110 },
  { time: '12:00', threats: 28, blocks: 90 },
  { time: '16:00', threats: 35, blocks: 130 },
  { time: '20:00', threats: 18, blocks: 60 },
];

const Dashboard: React.FC<DashboardProps> = ({ endpoints, alerts }) => {
  const stats = useMemo(() => ({
    total: endpoints.length,
    online: endpoints.filter(e => e.status === 'Online').length,
    critical: alerts.filter(a => a.severity === AlertSeverity.CRITICAL).length,
    vulnerable: endpoints.filter(e => e.status === 'Compromised' || e.avStatus === 'Disabled').length
  }), [endpoints, alerts]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Endpoints" 
          value={stats.total} 
          icon="fa-laptop-code" 
          trend="+2 this week" 
          color="blue" 
        />
        <StatCard 
          title="Security Alerts" 
          value={alerts.length} 
          icon="fa-triangle-exclamation" 
          trend={`${stats.critical} Critical`} 
          color="red" 
        />
        <StatCard 
          title="Network Uptime" 
          value="99.98%" 
          icon="fa-signal" 
          trend="Stable" 
          color="green" 
        />
        <StatCard 
          title="Vulnerabilities" 
          value={stats.vulnerable} 
          icon="fa-user-shield" 
          trend="Action required" 
          color="amber" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Trend Chart */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Threat Detection Trend</h3>
              <p className="text-sm text-slate-500">Real-time monitoring of blocked intrusion attempts</p>
            </div>
            <select className="bg-slate-800 border-none rounded-lg text-sm px-3 py-1 text-slate-300">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorThreat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBlock" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="threats" stroke="#ef4444" fillOpacity={1} fill="url(#colorThreat)" strokeWidth={2} />
                <Area type="monotone" dataKey="blocks" stroke="#3b82f6" fillOpacity={1} fill="url(#colorBlock)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">Device Health Status</h3>
          <div className="h-[250px] mb-6">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Online', count: stats.online },
                  { name: 'Offline', count: stats.total - stats.online },
                  { name: 'Risky', count: stats.vulnerable }
                ]}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    <Cell fill="#22c55e" />
                    <Cell fill="#64748b" />
                    <Cell fill="#f59e0b" />
                  </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Policy Compliance</span>
              <span className="text-sm font-medium">92%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '92%' }}></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">System Patches Applied</span>
              <span className="text-sm font-medium text-amber-500">74%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5">
              <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '74%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; icon: string; trend: string; color: 'blue' | 'red' | 'green' | 'amber' }> = ({ title, value, icon, trend, color }) => {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/5',
    red: 'bg-red-500/10 text-red-400 border-red-500/20 shadow-red-500/5',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/5',
  };

  const iconColors = {
    blue: 'text-blue-500',
    red: 'text-red-500',
    green: 'text-emerald-500',
    amber: 'text-amber-500',
  };

  return (
    <div className={`p-6 rounded-2xl border ${colors[color]} backdrop-blur-sm transition-transform hover:scale-[1.02] duration-300`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 mb-1">{title}</p>
          <h4 className="text-3xl font-bold tracking-tight">{value}</h4>
        </div>
        <div className={`w-10 h-10 rounded-xl bg-slate-900/50 flex items-center justify-center border border-slate-800 shadow-inner ${iconColors[color]}`}>
          <i className={`fa-solid ${icon}`}></i>
        </div>
      </div>
      <p className={`text-[10px] mt-4 font-semibold uppercase tracking-wider ${iconColors[color]}`}>
        {trend}
      </p>
    </div>
  );
};

export default Dashboard;
