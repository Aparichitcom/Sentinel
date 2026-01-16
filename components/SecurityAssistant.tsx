
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Endpoint, SecurityAlert } from '../types';

interface SecurityAssistantProps {
  endpoints: Endpoint[];
  alerts: SecurityAlert[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SecurityAssistant: React.FC<SecurityAssistantProps> = ({ endpoints, alerts }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello, I am the Sentinel Security AI. I can help you analyze your fleet status, identify threats, or suggest security hardening policies. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const prompt = `
        You are Sentinel AI, a cybersecurity expert. Use this system state to answer:
        Fleet: ${endpoints.length} desktops (${endpoints.filter(e => e.status === 'Online').length} online).
        Recent Alerts: ${alerts.map(a => `[${a.severity}] ${a.message}`).join('; ')}
        
        User question: ${userMsg}
        
        Provide a professional, technical, and actionable response.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to security intelligence core. Please check your network connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
         <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
             <i className="fa-solid fa-robot text-white text-sm"></i>
           </div>
           <div>
             <h4 className="text-sm font-bold">Sentinel AI Agent</h4>
             <div className="flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
               <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Core Active</span>
             </div>
           </div>
         </div>
         <button className="text-xs text-slate-500 hover:text-slate-300">Clear History</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
               <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                 msg.role === 'user' ? 'bg-slate-700' : 'bg-blue-600/20 text-blue-400'
               }`}>
                 <i className={`fa-solid ${msg.role === 'user' ? 'fa-user' : 'fa-shield-halved'} text-xs`}></i>
               </div>
               <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                 msg.role === 'user' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'bg-slate-800 border border-slate-700 text-slate-200'
               }`}>
                 <p className="whitespace-pre-wrap">{msg.content}</p>
               </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
               <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                 <i className="fa-solid fa-spinner animate-spin text-xs"></i>
               </div>
               <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
               </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-slate-900/80 border-t border-slate-800">
        <div className="relative flex gap-2">
          <input 
            type="text" 
            placeholder="Ask about endpoints, vulnerabilities, or recent alerts..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-200"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              !input.trim() || isLoading ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
            }`}
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-500 mt-2 font-medium">Sentinel AI might generate inaccurate responses. Always verify critical security actions.</p>
      </div>
    </div>
  );
};

export default SecurityAssistant;
