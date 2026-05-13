import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { MapPin, Thermometer, Waves, Sun, Users, ArrowRight } from 'lucide-react';

export default function Recommendations() {
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get('/recommendations/1')
      .then(res => { setRecommended(res.data); setLoading(false); })
      .catch(err => { console.error('Failed to fetch recommendations:', err); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="loading" style={{ paddingTop: 80 }}>
        <div className="loading-spinner" />
        Loading curated beaches...
      </div>
    );
  }

  const getScoreColor     = (s: number) => s >= 80 ? 'var(--safe)' : s >= 50 ? 'var(--moderate)' : 'var(--danger)';
  const getScoreBg        = (s: number) => s >= 80 ? 'rgba(34,197,94,0.12)' : s >= 50 ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)';
  const getCrowdBadge     = (c: string) => c === 'Low' ? 'badge-safe' : c === 'Moderate' ? 'badge-mod' : 'badge-danger';

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 className="header-title">Curated For You</h1>
        <p className="header-subtitle">Intelligently matched based on real-time safety, weather, and your preferences.</p>
      </div>

      {/* Grid of recommendation cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 20
      }}>
        {recommended.map(item => {
          const score = Math.round(item.personalized_score || 85);
          const temp  = 28 + (item.beach.id % 5);
          const wave  = (0.5 + (item.beach.id % 4) * 0.3).toFixed(1);
          const uv    = 5 + (item.beach.id % 4);
          const crowd = item.beach.id % 2 === 0 ? 'Low' : 'Moderate';

          return (
            <div
              key={item.beach.id}
              style={{
                position: 'relative',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                cursor: 'pointer',
                height: 340,
                boxShadow: 'var(--shadow)',
                transition: 'transform 0.22s ease, box-shadow 0.22s ease'
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow)';
              }}
              onClick={() => navigate(`/beach/${item.beach.id}`)}
            >
              {/* Beach image */}
              <img
                src={`https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80&sig=${item.beach.id}`}
                alt={item.beach.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Score badge (top-right) */}
              <div style={{
                position: 'absolute', top: 14, right: 14,
                background: getScoreBg(score),
                backdropFilter: 'blur(8px)',
                border: `2px solid ${getScoreColor(score)}`,
                color: getScoreColor(score),
                width: 44, height: 44, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 15, zIndex: 10
              }}>
                {score}
              </div>

              {/* Gradient overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(11,60,93,0.96) 0%, rgba(11,60,93,0.55) 50%, transparent 100%)',
                zIndex: 1
              }} />

              {/* Content */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '20px', zIndex: 2
              }}>
                {/* Name & Location */}
                <div style={{ marginBottom: 10 }}>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: 22, fontWeight: 700 }}>
                    {item.beach.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <MapPin size={13} color="rgba(255,255,255,0.6)" />
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{item.beach.location}</span>
                  </div>
                </div>

                {/* Data pills */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: 12, padding: '4px 10px', borderRadius: 20, backdropFilter: 'blur(4px)' }}>
                    <Thermometer size={12} /> {temp}°C
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: 12, padding: '4px 10px', borderRadius: 20, backdropFilter: 'blur(4px)' }}>
                    <Waves size={12} /> {wave}m
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: 12, padding: '4px 10px', borderRadius: 20, backdropFilter: 'blur(4px)' }}>
                    <Sun size={12} /> UV {uv}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, padding: '4px 10px', borderRadius: 20, backdropFilter: 'blur(4px)' }}
                    className={`badge ${getCrowdBadge(crowd)}`}
                  >
                    <Users size={12} /> {crowd}
                  </span>
                </div>

                {/* Why recommended */}
                <div style={{
                  borderTop: '1px solid rgba(255,255,255,0.15)',
                  paddingTop: 10,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <span style={{ color: 'var(--aqua-light)', fontSize: 13, fontStyle: 'italic' }}>
                    "{crowd} crowd · safe conditions today"
                  </span>
                  <ArrowRight size={16} color="var(--aqua-light)" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {recommended.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            No recommendations yet. Update your preferences to get personalized beach suggestions!
          </p>
        </div>
      )}
    </div>
  );
}
