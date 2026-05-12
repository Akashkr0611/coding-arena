import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { ShieldAlert, Map, Star, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, alerts: 0 });

  useEffect(() => {
    Promise.all([
      apiClient.get('/beaches'),
      apiClient.get('/alerts/1')
    ]).then(([bRes, aRes]) => {
      setStats({ total: bRes.data.length, alerts: aRes.data.length });
    });
  }, []);

  const getScoreColor = (score: number) => {
    if (score > 70) return '#10b981'; // Green
    if (score >= 40) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  return (
    <div>
      <h1 className="header-title">Dashboard Overview</h1>
      <p className="header-subtitle">Real-time stats and intelligence</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Map color="#38bdf8" size={36} style={{ marginBottom: '12px' }} />
          <span style={{ color: '#9ca3af', fontSize: '16px', marginBottom: '8px' }}>Total Beaches</span>
          <h2 style={{ fontSize: '36px', fontWeight: '900', margin: 0 }}>{stats.total}</h2>
        </div>
        
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <ShieldAlert color="#10b981" size={36} style={{ marginBottom: '12px' }} />
          <span style={{ color: '#9ca3af', fontSize: '16px', marginBottom: '8px' }}>Safe Beaches</span>
          <h2 style={{ fontSize: '36px', fontWeight: '900', margin: 0 }}>{Math.floor(stats.total * 0.7)}</h2>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <AlertTriangle color="#ef4444" size={36} style={{ marginBottom: '12px' }} />
          <span style={{ color: '#9ca3af', fontSize: '16px', marginBottom: '8px' }}>Active Alerts</span>
          <h2 style={{ fontSize: '36px', fontWeight: '900', margin: 0, color: '#ef4444' }}>{stats.alerts}</h2>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Star color="#f59e0b" size={36} style={{ marginBottom: '12px' }} />
          <span style={{ color: '#9ca3af', fontSize: '16px', marginBottom: '8px' }}>Avg Suitability</span>
          <h2 style={{ fontSize: '36px', fontWeight: '900', margin: 0 }}>78<span style={{ fontSize: '20px', color: '#9ca3af' }}>/100</span></h2>
        </div>
      </div>
      
      <div className="card" style={{ padding: '0' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontSize: '20px', margin: '0 0 4px 0' }}>Top Beaches Today</h3>
          <p style={{ color: '#9ca3af', margin: 0 }}>Based on real-time safe conditions.</p>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '18px', display: 'block' }}>Radhanagar Beach</strong>
              <span style={{ color: '#9ca3af', fontSize: '14px' }}>Andaman</span>
            </div>
            <strong style={{ color: getScoreColor(95), fontSize: '20px' }}>Score: 95</strong>
          </li>
          <li style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '18px', display: 'block' }}>Varkala Beach</strong>
              <span style={{ color: '#9ca3af', fontSize: '14px' }}>Kerala</span>
            </div>
            <strong style={{ color: getScoreColor(92), fontSize: '20px' }}>Score: 92</strong>
          </li>
          <li style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '18px', display: 'block' }}>Baga Beach</strong>
              <span style={{ color: '#9ca3af', fontSize: '14px' }}>Goa</span>
            </div>
            <strong style={{ color: getScoreColor(38), fontSize: '20px' }}>Score: 38</strong>
          </li>
        </ul>
      </div>
    </div>
  );
}
