
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
    { id: 'endpoints', icon: 'fa-desktop', label: 'Endpoints' },
    { id: 'network', icon: 'fa-network-wired', label: 'Network' },
    { id: 'alerts', icon: 'fa-shield-halved', label: 'Alerts' },
    { id: 'ai-assistant', icon: 'fa-robot', label: 'Security AI' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
            <i className="fa-solid fa-satellite-dish text-white text-xl"></i>
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            SENTINEL
          </span>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-6 text-center`}></i>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
               <img src="https://picsum.photos/32/32" alt="admin" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Admin Terminal</p>
              <p className="text-[10px] text-slate-500 truncate">System Administrator</p>
            </div>
            <i className="fa-solid fa-right-from-bracket text-slate-500 hover:text-red-400 cursor-pointer transition-colors"></i>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold capitalize">{activeTab.replace('-', ' ')}</h1>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">LIVE_FEED</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative group">
                <button className="w-10 h-10 rounded-full hover:bg-slate-800 flex items-center justify-center transition-colors relative">
                  <i className="fa-regular fa-bell text-slate-400 group-hover:text-blue-400"></i>
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
                </button>
             </div>
             <div className="h-8 w-px bg-slate-800"></div>
             <div className="text-right">
                <p className="text-xs font-medium text-slate-300">Monitored Fleet</p>
                <p className="text-[10px] text-green-500 font-bold">128 ONLINE / 14 OFFLINE</p>
             </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#020617]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
