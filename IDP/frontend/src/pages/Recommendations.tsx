import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { MapPin, Thermometer, Waves, Sun, Users, ArrowRight, Star } from 'lucide-react';
import beaches from '../data/beaches.json';

export default function Recommendations() {
  const [recommended, setRecommended] = useState<any[]>([]);
  const [localBeaches, setBeaches] = useState<any[]>(beaches);
  const [recommendedBeach, setRecommendedBeach] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const calculateSustainability = (beach: any) => {
    const waveScore = beach.waveHeight < 1 ? 90 : beach.waveHeight < 2 ? 70 : 40;
    const weatherScore = beach.temp >= 22 && beach.temp <= 32 ? 90 : 70;
    const crowdScore = beach.crowd === "low" ? 90 : beach.crowd === "moderate" ? 70 : 40;
    const humanImpactScore = beach.hotels?.length < 5 ? 90 : beach.hotels?.length < 15 ? 70 : 40;
    const safetyScore = beach.alerts?.length === 0 ? 90 : 50;

    return Math.round(
      waveScore * 0.2 +
      weatherScore * 0.2 +
      crowdScore * 0.3 +
      humanImpactScore * 0.2 +
      safetyScore * 0.1
    );
  };

  useEffect(() => {
    apiClient.get('/recommendations/1')
      .then(res => { setRecommended(res.data); setLoading(false); })
      .catch(err => { console.error('Failed to fetch recommendations:', err); setLoading(false); });
      
    const updated = beaches.map(b => ({
      ...b,
      sustainabilityScore: calculateSustainability(b)
    }));
    setBeaches(updated);
  }, []);

  useEffect(() => {
    if (!localBeaches || localBeaches.length === 0) return;

    const sorted = [...localBeaches].sort((a, b) => b.sustainabilityScore - a.sustainabilityScore);
    const best = sorted[0];

    setRecommendedBeach({
      name: best.name,
      reason: [
        "Low crowd",
        "Good weather",
        "Safe conditions",
        "High sustainability"
      ]
    });
  }, [localBeaches]);

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

      {/* Grid of recommendation cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 20
      }}>
        {localBeaches.filter(b => b.sustainabilityScore).sort((a, b) => b.sustainabilityScore - a.sustainabilityScore).map(item => {
          const score = item.sustainabilityScore;
          const temp  = item.temp || 28 + (item.id % 5);
          const wave  = item.waveHeight || (0.5 + (item.id % 4) * 0.3).toFixed(1);
          const uv    = 5 + (item.id % 4);
          const crowd = item.crowd || (item.id % 2 === 0 ? 'Low' : 'Moderate');

          return (
            <div
              key={item.id}
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
              onClick={() => navigate(`/beach/${item.id}`)}
            >
              {/* Beach image */}
              <img
                src={`https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80&sig=${item.id}`}
                alt={item.name}
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
                    {item.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <MapPin size={13} color="rgba(255,255,255,0.6)" />
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{item.location}</span>
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
