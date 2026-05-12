import { useEffect, useState } from 'react';
import { AlertTriangle, Info, Sun } from 'lucide-react';
import apiClient from '../api/client';

export default function Alerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/alerts/1')
      .then(res => {
        setAlerts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch alerts:', err);
        setLoading(false);
      });
  }, []);

  const getIcon = (type: string) => {
    switch(type) {
      case 'danger': return <AlertTriangle color="#ef4444" />;
      case 'warning': return <Sun color="#f59e0b" />;
      case 'info': return <Info color="#0ea5e9" />;
      default: return <Info color="#64748b" />;
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h2 className="header-title">Active Alerts</h2>
      <p className="header-subtitle">Stay safe out there</p>
      
      {alerts.map(alert => (
        <div key={alert.id} className="card" style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ marginRight: '16px', padding: '12px', borderRadius: '50%', backgroundColor: '#f1f5f9' }}>
            {getIcon(alert.type)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <strong>Baga Beach</strong>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>{new Date(alert.timestamp).toLocaleTimeString()}</span>
            </div>
            <p style={{ color: '#475569', fontSize: '14px', margin: 0 }}>{alert.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
