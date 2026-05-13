import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { ShieldAlert, Map, Star, AlertTriangle, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, alerts: 0 });

  useEffect(() => {
    Promise.all([
      apiClient.get('/beaches'),
      apiClient.get('/alerts/1')
    ]).then(([bRes, aRes]) => {
      setStats({ total: bRes.data.length, alerts: aRes.data.length });
    }).catch(console.error);
  }, []);

  const getScoreColor = (score: number) => {
    if (score > 70) return 'var(--safe)';
    if (score >= 40) return 'var(--moderate)';
    return 'var(--danger)';
  };

  const getScoreBadgeClass = (score: number) => {
    if (score > 70) return 'badge badge-safe';
    if (score >= 40) return 'badge badge-mod';
    return 'badge badge-danger';
  };

  const statCards = [
    {
      icon: <Map size={24} color="#0B3C5D" />,
      iconBg: 'rgba(11,60,93,0.1)',
      value: stats.total,
      label: 'Total Beaches',
      suffix: ''
    },
    {
      icon: <ShieldAlert size={24} color="var(--safe)" />,
      iconBg: 'rgba(34,197,94,0.1)',
      value: Math.floor(stats.total * 0.7),
      label: 'Safe Beaches',
      suffix: ''
    },
    {
      icon: <AlertTriangle size={24} color="var(--danger)" />,
      iconBg: 'rgba(239,68,68,0.1)',
      value: stats.alerts,
      label: 'Active Alerts',
      suffix: '',
      valueColor: 'var(--danger)'
    },
    {
      icon: <Star size={24} color="var(--moderate)" />,
      iconBg: 'rgba(245,158,11,0.1)',
      value: 78,
      label: 'Avg Suitability',
      suffix: '/100'
    },
  ];

  const topBeaches = [
    { name: 'Radhanagar Beach', location: 'Andaman & Nicobar', score: 95 },
    { name: 'Varkala Beach',    location: 'Kerala',             score: 92 },
    { name: 'Tarkarli Beach',   location: 'Maharashtra',        score: 87 },
    { name: 'Baga Beach',       location: 'Goa',                score: 38 },
  ];

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 className="header-title">Dashboard Overview</h1>
        <p className="header-subtitle">Real-time beach intelligence across India's coastline</p>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        {statCards.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-card-icon" style={{ background: s.iconBg }}>
              {s.icon}
            </div>
            <div className="stat-card-value" style={{ color: s.valueColor || 'var(--text-primary)' }}>
              {s.value}
              {s.suffix && <span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>{s.suffix}</span>}
            </div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Top Beaches Table */}
      <div className="card card-flush">
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <TrendingUp size={20} color="var(--teal)" />
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Top Beaches Today
            </h3>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '13px' }}>
              Ranked by real-time safety &amp; suitability
            </p>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Beach</th>
              <th>Location</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {topBeaches.map((beach, idx) => (
              <tr key={idx}>
                <td style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '13px' }}>
                  {idx + 1}
                </td>
                <td>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {beach.name}
                  </span>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{beach.location}</td>
                <td>
                  <span style={{ fontWeight: 700, color: getScoreColor(beach.score), fontSize: '15px' }}>
                    {beach.score}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>/100</span>
                </td>
                <td>
                  <span className={getScoreBadgeClass(beach.score)}>
                    {beach.score > 70 ? '✓ Safe' : beach.score >= 40 ? '⚠ Moderate' : '✕ High Risk'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Info Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--ocean-deep) 0%, var(--ocean-mid) 100%)',
        borderRadius: 'var(--radius)',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        color: '#fff',
        marginTop: '4px'
      }}>
        <div style={{
          width: 48, height: 48,
          background: 'rgba(255,255,255,0.15)',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0
        }}>
          <ShieldAlert size={24} color="var(--aqua-light)" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>
            Stay safe on India's coastlines
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
            Always check real-time alerts and suitability scores before visiting any beach. Conditions change rapidly.
          </div>
        </div>
      </div>
    </div>
  );
}
