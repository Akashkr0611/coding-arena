import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { ShieldAlert, Map, Star, AlertTriangle, TrendingUp } from 'lucide-react';
import beaches from '../data/beaches.json';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: beaches.length, alerts: 0 });
  const [localBeaches, setBeaches] = useState<any[]>(beaches);
  const [recommendedBeach, setRecommendedBeach] = useState<any>(null);

  const getCrowd = () => {
    const day = new Date().getDay();
    if (day === 0 || day === 6) return "high";
    return "moderate";
  };

  const calculateSustainability = (b: any) => {
    let score = 60; // strong base

    // Wave (good if calm)
    if (b.waveHeight < 1) score += 15;
    else if (b.waveHeight < 2) score += 10;
    else score += 5;

    // Weather
    if (b.temp >= 25 && b.temp <= 32) score += 10;
    else score += 5;

    // Crowd
    if (b.crowd === "low") score += 10;
    else if (b.crowd === "moderate") score += 5;

    // Hotels (less = better)
    if (b.hotels?.length < 5) score += 10;
    else if (b.hotels?.length < 15) score += 5;

    // Alerts
    if (!b.alerts || b.alerts.length === 0) score += 10;
    else score += 5;

    return Math.min(95, Math.round(score));
  };

  useEffect(() => {
    apiClient.get('/alerts/1')
      .then((aRes) => {
        setStats({ total: beaches.length, alerts: aRes.data.length });
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!beaches || beaches.length === 0) return;
      
    const updated = beaches.map((b: any) => {
      const beachWithCrowd = { ...b, crowd: b.crowd || getCrowd() };
      return {
        ...beachWithCrowd,
        sustainabilityScore: calculateSustainability(beachWithCrowd)
      };
    });
    setBeaches(updated);

    const sorted = [...updated].sort((a, b) => b.sustainabilityScore - a.sustainabilityScore);
    const best = sorted[0];

    if (best) {
      setRecommendedBeach({
        name: best.name,
        reason: [
          "Low crowd",
          "Good weather",
          "Safe conditions",
          "High sustainability"
        ]
      });
    }
  }, [beaches]);

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

  const getDiverseTopBeaches = () => {
    const sorted = [...localBeaches]
      .filter(b => b.sustainabilityScore)
      .sort((a, b) => b.sustainabilityScore - a.sustainabilityScore);

    const stateCount: Record<string, number> = {};
    const diverseBeaches = [];

    for (let beach of sorted) {
      const state = beach.state;
      if (!stateCount[state]) stateCount[state] = 0;

      if (stateCount[state] < 2) {
        diverseBeaches.push(beach);
        stateCount[state]++;
      }

      if (diverseBeaches.length === 5) break;
    }

    return diverseBeaches.map(b => ({
      name: b.name,
      location: b.state,
      score: b.sustainabilityScore
    }));
  };

  const topBeaches = getDiverseTopBeaches();

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

      {recommendedBeach && (
        <div className="card" style={{ marginBottom: '28px', background: 'var(--card-bg)' }}>
          <h2 style={{ fontSize: 18, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Star size={20} color="var(--moderate)" /> Best Beach For You 🌊
          </h2>
          <h3 style={{ fontSize: 22, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 16 }}>{recommendedBeach.name}</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {recommendedBeach.reason.map((r: string) => (
              <li key={r} style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--safe)' }}>✔</span> {r}
              </li>
            ))}
          </ul>
        </div>
      )}

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
