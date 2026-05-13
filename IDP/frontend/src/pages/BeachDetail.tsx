import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Cloud, Navigation, ShieldAlert, AlertTriangle } from 'lucide-react';
import apiClient from '../api/client';

export default function BeachDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('swimming');

  useEffect(() => {
    Promise.all([
      apiClient.get(`/beach/${id}`),
      apiClient.get(`/beach/${id}/suitability`),
      apiClient.get(`/alerts/${id}`)
    ]).then(([beachRes, scoresRes, alertsRes]) => {
      const beach = beachRes.data;
      const parsedId = parseInt(id || '1', 10);
      const uv = beach.weather?.[0]?.uv_index || (5 + (parsedId % 3));
      const crowd = parsedId % 3 === 0 ? 'High' : parsedId % 2 === 0 ? 'Moderate' : 'Low';
      setData({
        id,
        name: beach.name || 'Unknown Beach',
        scores: scoresRes.data,
        weather: {
          temperature: beach.weather?.[0]?.temperature || (28 + parsedId % 5),
          wind: beach.weather?.[0]?.wind_speed || (10 + parsedId % 10),
          uv
        },
        tide: { waveHeight: beach.tides?.[0]?.wave_height || 1.0 },
        safety: { ripCurrentRisk: beach.safety?.rip_current_risk || 'Moderate' },
        crowd,
        alerts: alertsRes.data.map((a: any) => a.message)
      });
    }).catch(err => console.error('Error fetching beach details:', err));
  }, [id]);

  if (!data) {
    return (
      <div className="loading" style={{ paddingTop: 80 }}>
        <div className="loading-spinner" />
        Loading beach details...
      </div>
    );
  }

  const score = Math.round(data.scores[activeTab] ?? 60);
  const scoreColor = score >= 80 ? 'var(--safe)' : score >= 50 ? 'var(--moderate)' : 'var(--danger)';
  const scoreBg    = score >= 80 ? 'rgba(34,197,94,0.1)' : score >= 50 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';

  const getUvBadgeClass = (uv: number) => uv <= 2 ? 'badge-safe' : uv <= 5 ? 'badge-mod' : 'badge-danger';
  const getUvLabel      = (uv: number) => uv <= 2 ? 'Low' : uv <= 5 ? 'Moderate' : uv <= 7 ? 'High' : 'Extreme';
  const getCrowdClass   = (c: string) => c === 'Low' ? 'badge-safe' : c === 'Moderate' ? 'badge-mod' : 'badge-danger';

  const tabs = ['swimming', 'surfing', 'relaxing', 'family'];

  return (
    <div className="page-wrapper">
      {/* Back nav */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-ghost"
        style={{ marginBottom: 24, display: 'inline-flex' }}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <h1 className="header-title" style={{ marginBottom: 24 }}>{data.name}</h1>

      {/* Suitability card */}
      <div className="card" style={{ textAlign: 'center', marginBottom: 20 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16, fontWeight: 500 }}>
          SUITABILITY INDEX
        </p>

        {/* Circular score */}
        <div style={{
          position: 'relative',
          width: 120, height: 120,
          margin: '0 auto 20px',
          borderRadius: '50%',
          background: scoreBg,
          border: `6px solid ${scoreColor}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div>
            <div style={{ fontSize: 38, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{score}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>/100</div>
          </div>
        </div>

        {/* Tab selector */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Weather + Marine grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
        {/* Weather card */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, background: 'rgba(20,184,166,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cloud size={20} color="var(--teal)" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>WEATHER</span>
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
            {data.weather.temperature}°C
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Wind Speed</span>
            <strong>{Math.round(data.weather.wind)} km/h</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ color: 'var(--text-secondary)' }}>UV Index</span>
            <span className={`badge ${getUvBadgeClass(data.weather.uv)}`}>
              {getUvLabel(data.weather.uv)} ({data.weather.uv})
            </span>
          </div>
        </div>

        {/* Marine & Crowd card */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, background: 'rgba(11,60,93,0.08)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Navigation size={20} color="var(--ocean-deep)" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>MARINE & CROWD</span>
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
            {data.tide.waveHeight.toFixed(1)}m
            <span style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 500 }}> wave</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Tide Level</span>
            <strong>~1.5m</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Crowd Level</span>
            <span className={`badge ${getCrowdClass(data.crowd)}`}>{data.crowd}</span>
          </div>
        </div>
      </div>

      {/* Safety & Alerts card */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, background: 'rgba(245,158,11,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={20} color="var(--moderate)" />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Safety &amp; Alerts
          </h3>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 16px',
          background: 'var(--bg)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border)',
          marginBottom: data.alerts.length > 0 ? 14 : 0
        }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Rip Current Risk</span>
          <span className={`badge ${data.safety.ripCurrentRisk === 'High' ? 'badge-danger' : data.safety.ripCurrentRisk === 'Moderate' ? 'badge-mod' : 'badge-safe'}`}>
            {data.safety.ripCurrentRisk}
          </span>
        </div>

        {data.alerts.length > 0 && data.alerts.map((alert: string, idx: number) => (
          <div key={idx} style={{
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.2)',
            padding: '14px 16px',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--danger)',
            marginTop: 8,
            display: 'flex', alignItems: 'flex-start', gap: 10,
            fontSize: 14
          }}>
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
            {alert}
          </div>
        ))}
      </div>
    </div>
  );
}
