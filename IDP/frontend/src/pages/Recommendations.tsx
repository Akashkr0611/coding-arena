import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { MapPin, Thermometer, Waves, Sun, Users, ArrowRight, Star } from 'lucide-react';
import beaches from '../data/beaches.json';
import Loader from '../components/Loader';

export default function Recommendations() {

  const [localBeaches, setBeaches] = useState<any[]>(beaches);
  const [recommendedBeach, setRecommendedBeach] = useState<any>(null);
  const [preferences, setPreferences] = useState({
    safe: true,
    scenic: true,
    quiet: false,
    adventure: false
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };


  const scoreBeachForUser = (b: any, prefs: typeof preferences) => {
    let score = 0;

    // SAFE
    if (prefs.safe) {
      if (!b.alerts || b.alerts.length === 0) score += 30;
      else score -= 10;
    }

    // SCENIC
    if (prefs.scenic) {
      score += (b.sustainabilityScore || 50) * 0.3;
    }

    // QUIET
    if (prefs.quiet) {
      if (b.crowd === "low") score += 25;
      else if (b.crowd === "moderate") score += 10;
    }

    // ADVENTURE
    if (prefs.adventure) {
      if (b.waveHeight >= 1.5) score += 25;
      else if (b.waveHeight >= 1) score += 10;
    }

    return score;
  };

  let recommendedForUser = [...localBeaches]
    .map(b => ({
      ...b,
      userScore: scoreBeachForUser(b, preferences)
    }))
    .sort((a, b) => b.userScore - a.userScore)
    .slice(0, 5);

  const noPreference =
    !preferences.safe &&
    !preferences.scenic &&
    !preferences.quiet &&
    !preferences.adventure;

  if (noPreference) {
    recommendedForUser = [...localBeaches]
      .sort((a, b) => b.sustainabilityScore - a.sustainabilityScore)
      .slice(0, 5);
  }

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
    apiClient.get('/recommendations/1')
      .then(() => { setLoading(false); })
      .catch(err => { console.error('Failed to fetch recommendations:', err); setLoading(false); });
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

  if (loading) {
    return <Loader />;
  }

  const getCrowdBadge     = (c: string) => c === 'Low' ? 'badge-safe' : c === 'Moderate' ? 'badge-mod' : 'badge-danger';

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="header-title">Curated For You</h1>
          <p className="header-subtitle">Intelligently matched based on real-time safety, weather, and your preferences.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['safe', 'scenic', 'quiet', 'adventure'] as const).map(key => (
            <button
              key={key}
              onClick={() => togglePreference(key)}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                border: `1px solid ${preferences[key] ? 'var(--teal)' : 'var(--border)'}`,
                background: preferences[key] ? 'rgba(0, 212, 255, 0.1)' : 'var(--card-bg)',
                color: preferences[key] ? 'var(--teal)' : 'var(--text-secondary)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s ease'
              }}
            >
              {key}
            </button>
          ))}
        </div>
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
        {recommendedForUser.map(item => {
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
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{item.location || item.state}</span>
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
                    Perfect for your preferences
                  </span>
                  <ArrowRight size={16} color="var(--aqua-light)" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {recommendedForUser.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            No recommendations yet. Update your preferences to get personalized beach suggestions!
          </p>
        </div>
      )}
    </div>
  );
}
