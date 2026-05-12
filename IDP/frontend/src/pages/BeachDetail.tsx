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
          uv: uv
        },
        tide: { waveHeight: beach.tides?.[0]?.wave_height || 1.0 },
        safety: { ripCurrentRisk: beach.safety?.rip_current_risk || 'Moderate' },
        crowd: crowd,
        alerts: alertsRes.data.map((a: any) => a.message)
      });
    }).catch(err => {
      console.error('Error fetching beach details:', err);
    });
  }, [id]);

  if (!data) return <div className="loading">Loading Details...</div>;

  const scoreColor = data.scores[activeTab] >= 80 ? '#10b981' : data.scores[activeTab] >= 50 ? '#f59e0b' : '#ef4444';

  const getUvBadge = (uv: number) => {
    const label = uv <= 2 ? 'Low' : uv <= 5 ? 'Moderate' : uv <= 7 ? 'High' : 'Extreme';
    const color = uv <= 2 ? '#10b981' : uv <= 5 ? '#f59e0b' : '#ef4444';
    return <span className="badge" style={{ background: `${color}20`, color }}>{label} ({uv})</span>;
  };

  const getCrowdBadge = (crowd: string) => {
    const color = crowd === 'Low' ? '#10b981' : crowd === 'Moderate' ? '#f59e0b' : '#ef4444';
    const icon = crowd === 'Low' ? '🟢' : crowd === 'Moderate' ? '🟡' : '🔴';
    return <span className="badge" style={{ background: `${color}20`, color }}>{icon} {crowd}</span>;
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', cursor: 'pointer', color: '#9ca3af' }} onClick={() => navigate(-1)}>
        <ArrowLeft size={24} style={{ marginRight: '8px' }} />
        <h2 style={{ margin: 0, color: '#ffffff' }}>{data.name}</h2>
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        <h3 className="header-subtitle" style={{ color: 'white' }}>Suitability Index</h3>
        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 16px auto', borderRadius: '50%', border: `12px solid ${scoreColor}40`, borderTopColor: scoreColor, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: '36px', fontWeight: 'bold', color: 'white' }}>{Math.round(data.scores[activeTab])}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px', flexWrap: 'wrap' }}>
          {['swimming', 'surfing', 'relaxing', 'family'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === tab ? '#38bdf8' : 'rgba(255,255,255,0.05)',
                color: activeTab === tab ? '#0f172a' : '#9ca3af',
                fontWeight: 'bold',
                textTransform: 'capitalize',
                transition: 'all 0.2s'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div className="card" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
          <Cloud color="#38bdf8" size={28} />
          <p style={{ color: '#9ca3af', margin: '12px 0 8px 0' }}>Weather</p>
          <h2 style={{ margin: '0 0 12px 0', fontSize: '32px' }}>{data.weather.temperature}°C</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#9ca3af' }}>Wind</span>
            <strong>{Math.round(data.weather.wind)} km/h</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#9ca3af' }}>UV Index</span>
            {getUvBadge(data.weather.uv)}
          </div>
        </div>
        
        <div className="card" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
          <Navigation color="#38bdf8" size={28} />
          <p style={{ color: '#9ca3af', margin: '12px 0 8px 0' }}>Marine & Crowd</p>
          <h2 style={{ margin: '0 0 12px 0', fontSize: '32px' }}>{data.tide.waveHeight.toFixed(1)}m <span style={{fontSize: '16px', color:'#9ca3af'}}>wave</span></h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#9ca3af' }}>Tide Level</span>
            <strong>~1.5m</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#9ca3af' }}>Crowd</span>
            {getCrowdBadge(data.crowd)}
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <ShieldAlert color="#f59e0b" style={{ marginRight: '8px' }} />
          <h3 style={{ margin: 0, fontSize: '20px' }}>Safety & Alerts</h3>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ color: '#9ca3af' }}>Rip Current Risk</span>
          <strong style={{ color: data.safety.ripCurrentRisk === 'High' ? '#ef4444' : '#10b981' }}>{data.safety.ripCurrentRisk}</strong>
        </div>
        
        {data.alerts.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            {data.alerts.map((alert: string, idx: number) => (
              <div key={idx} style={{ backgroundColor: '#ef444420', padding: '16px', borderRadius: '8px', color: '#ef4444', marginTop: '8px', display: 'flex', alignItems: 'center', border: '1px solid #ef444440' }}>
                <AlertTriangle size={20} style={{ marginRight: '12px' }} />
                {alert}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
