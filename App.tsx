
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import EndpointList from './components/EndpointList';
import AlertHub from './components/AlertHub';
import SecurityAssistant from './components/SecurityAssistant';
import { MOCK_ENDPOINTS, MOCK_ALERTS } from './constants';
import { Endpoint, SecurityAlert } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [endpoints, setEndpoints] = useState<Endpoint[]>(MOCK_ENDPOINTS);
  const [alerts, setAlerts] = useState<SecurityAlert[]>(MOCK_ALERTS);

  // Simulation of live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEndpoints(prev => prev.map(ep => ({
        ...ep,
        cpuUsage: ep.status === 'Online' ? Math.floor(Math.random() * 30) + 5 : 0,
        memoryUsage: ep.status === 'Online' ? Math.floor(Math.random() * 20) + 30 : 0,
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard endpoints={endpoints} alerts={alerts} />;
      case 'endpoints':
        return <EndpointList endpoints={endpoints} />;
      case 'alerts':
        return <AlertHub alerts={alerts} />;
      case 'ai-assistant':
        return <SecurityAssistant endpoints={endpoints} alerts={alerts} />;
      case 'network':
        return (
          <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500 opacity-50">
            <i className="fa-solid fa-network-wired text-6xl mb-4"></i>
            <h3 className="text-xl font-bold">Network Map Visualization</h3>
            <p>Traffic monitoring module is being initialized...</p>
          </div>
        );
      default:
        return <Dashboard endpoints={endpoints} alerts={alerts} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
