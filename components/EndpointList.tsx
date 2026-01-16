
import React, { useState } from 'react';
import { Endpoint } from '../types';

interface EndpointListProps {
  endpoints: Endpoint[];
}

const EndpointList: React.FC<EndpointListProps> = ({ endpoints }) => {
  const [filter, setFilter] = useState('');

  const filteredEndpoints = endpoints.filter(e => 
    e.hostname.toLowerCase().includes(filter.toLowerCase()) || 
    e.ip.includes(filter)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
          <input 
            type="text" 
            placeholder="Search hostname, IP, or OS..." 
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2">
            <i className="fa-solid fa-download"></i> Export Inventory
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 text-white">
            <i className="fa-solid fa-plus"></i> Enroll Device
          </button>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/80 border-b border-slate-800 text-[11px] uppercase tracking-widest text-slate-500 font-bold">
              <th className="px-6 py-4">Endpoint</th>
              <th className="px-6 py-4">System Details</th>
              <th className="px-6 py-4">Security Status</th>
              <th className="px-6 py-4">Network Activity</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredEndpoints.map((ep) => (
              <tr key={ep.id} className="hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                      ep.status === 'Online' ? 'bg-green-500/10 text-green-400' : 
                      ep.status === 'Compromised' ? 'bg-red-500/10 text-red-400' : 'bg-slate-800 text-slate-500'
                    }`}>
                      <i className={`fa-solid ${ep.os.toLowerCase().includes('windows') ? 'fa-windows' : ep.os.toLowerCase().includes('mac') ? 'fa-apple' : 'fa-linux'}`}></i>
                    </div>
                    <div>
                      <p className="font-bold text-slate-200">{ep.hostname}</p>
                      <p className="text-[10px] font-mono text-slate-500">{ep.ip}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <p className="text-xs text-slate-300 mb-1">{ep.os}</p>
                  <p className="text-[10px] text-slate-500">Seen: {ep.lastSeen}</p>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${ep.avStatus === 'Active' ? 'bg-green-500 animate-pulse' : ep.avStatus === 'Disabled' ? 'bg-red-500' : 'bg-amber-500'}`}></span>
                       <span className="text-[11px] font-medium">Antivirus: {ep.avStatus}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${ep.firewall ? 'bg-green-500' : 'bg-red-500'}`}></span>
                       <span className="text-[11px] font-medium">Firewall: {ep.firewall ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="w-32">
                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                      <span>CPU: {ep.cpuUsage}%</span>
                      <span>MEM: {ep.memoryUsage}%</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${ep.cpuUsage > 80 ? 'bg-red-500' : 'bg-blue-500'}`} 
                        style={{ width: `${ep.cpuUsage}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white transition-all">
                      <i className="fa-solid fa-terminal text-xs"></i>
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-amber-600 text-slate-400 hover:text-white transition-all">
                      <i className="fa-solid fa-shield text-xs"></i>
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white transition-all">
                      <i className="fa-solid fa-power-off text-xs"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EndpointList;
