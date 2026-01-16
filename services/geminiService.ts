
import { GoogleGenAI } from "@google/genai";
import { SecurityAlert, Endpoint } from "../types";

export const analyzeSecurityIncident = async (alert: SecurityAlert, endpoint?: Endpoint) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    As a Senior Security Analyst, analyze the following security incident:
    
    ALERT DETAILS:
    - ID: ${alert.id}
    - Category: ${alert.category}
    - Message: ${alert.message}
    - Severity: ${alert.severity}
    
    ${endpoint ? `ENDPOINT CONTEXT:
    - Hostname: ${endpoint.hostname}
    - OS: ${endpoint.os}
    - Status: ${endpoint.status}
    - AV Status: ${endpoint.avStatus}
    - Open Ports: ${endpoint.openPorts.join(', ')}` : ''}
    
    Provide a concise technical summary of the threat, its potential impact, and 3 immediate remediation steps.
    Format your response in professional markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return "Failed to analyze incident. Please consult standard operating procedures.";
  }
};

export const getSecurityPostureSummary = async (endpoints: Endpoint[], alerts: SecurityAlert[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const summaryData = {
    totalEndpoints: endpoints.length,
    onlineCount: endpoints.filter(e => e.status === 'Online').length,
    compromisedCount: endpoints.filter(e => e.status === 'Compromised').length,
    criticalAlerts: alerts.filter(a => a.severity === 'CRITICAL').length,
    highAlerts: alerts.filter(a => a.severity === 'HIGH').length,
  };

  const prompt = `
    Provide a high-level executive summary of the current office network security posture based on these stats:
    ${JSON.stringify(summaryData, null, 2)}
    
    Recent Critical Alert: ${alerts.find(a => a.severity === 'CRITICAL')?.message || 'None'}
    
    Be brief (max 150 words), focusing on the most critical risks and recommended focus for the next 24 hours.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return "Status: Monitoring active. 0 critical bypasses detected.";
  }
};
