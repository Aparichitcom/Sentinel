
import React, { useState } from 'react';
import { SecurityAlert, AlertSeverity } from '../types';
import { analyzeSecurityIncident } from '../services/geminiService';

interface AlertHubProps {
  alerts: SecurityAlert[];
}

const AlertHub: React.FC<AlertHubProps> = ({ alerts }) => {
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (alert: SecurityAlert) => {
    setSelectedAlert(alert);
    setIsAnalyzing(true);
    setAnalysis(null);
    const result = await analyzeSecurityIncident(alert);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const getSeverityStyles = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.CRITICAL: return 'bg-red-500/10 text-red-500 border-red-500/20';
      case AlertSeverity.HIGH: return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case AlertSeverity.MEDIUM: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case AlertSeverity.LOW: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Alert List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <i className="fa-solid fa-list-check text-slate-500"></i>
          Active Incident Log
        </h3>
        <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              onClick={() => setSelectedAlert(alert)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-slate-500 ${
                selectedAlert?.id === alert.id ? 'bg-slate-800 border-slate-600' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getSeverityStyles(alert.severity)}`}>
                  {alert.severity}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-slate-100 mb-1">{alert.message}</h4>
              <div className="flex items-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><i className="fa-solid fa-tag text-blue-500"></i> {alert.category}</span>
                <span className="flex items-center gap-1"><i className="fa-solid fa-desktop text-purple-500"></i> {alert.source}</span>
                <span className="flex items-center gap-1"><i className="fa-solid fa-circle-info text-amber-500"></i> {alert.status}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleAnalyze(alert); }}
                  className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs rounded-lg border border-blue-500/20 transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-wand-magic-sparkles"></i> AI Analysis
                </button>
                <button 
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs rounded-lg border border-slate-700 transition-all"
                >
                  Resolve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Panel */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 sticky top-0 h-fit min-h-[500px] flex flex-col">
        {selectedAlert ? (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4">
             <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                   <i className="fa-solid fa-microchip text-xl"></i>
                 </div>
                 <div>
                   <h3 className="text-xl font-bold">Analysis Engine</h3>
                   <p className="text-sm text-slate-500">Intelligent Threat Interpretation</p>
                 </div>
               </div>
               <span className="text-xs font-mono text-slate-600">{selectedAlert.id}</span>
             </div>

             {isAnalyzing ? (
               <div className="flex-1 flex flex-col items-center justify-center gap-4">
                 <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                 <p className="text-sm text-slate-400 animate-pulse">Running heuristic pattern matching...</p>
               </div>
             ) : analysis ? (
               <div className="flex-1 space-y-6">
                 <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
                    <div className="prose prose-invert max-w-none text-sm text-slate-300 whitespace-pre-line font-medium leading-relaxed">
                      {analysis}
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <button className="py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                     Isolate Network
                   </button>
                   <button className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                     Kill Process
                   </button>
                 </div>
               </div>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-center px-10">
                 <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 opacity-50">
                    <i className="fa-solid fa-fingerprint text-3xl"></i>
                 </div>
                 <h4 className="text-slate-300 font-bold mb-2">Select an alert for inspection</h4>
                 <p className="text-sm text-slate-500">Run the Sentinel AI agent to get deep insights and automated remediation suggestions for this specific threat vector.</p>
                 <button 
                  onClick={() => handleAnalyze(selectedAlert)}
                  className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20"
                 >
                   Perform Full Analysis
                 </button>
               </div>
             )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
            <i className="fa-solid fa-shield-virus text-6xl mb-6"></i>
            <h3 className="text-2xl font-bold">No Alert Selected</h3>
            <p className="text-slate-400 max-w-xs mt-2">Pick an event from the incident log to begin deep-packet and host-level inspection.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertHub;
