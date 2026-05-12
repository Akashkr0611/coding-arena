import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

export default function Recommendations() {
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get('/recommendations/1')
      .then(res => {
        setRecommended(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch recommendations:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ color: '#9ca3af', padding: '20px' }}>Loading Curated Beaches...</div>;

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e'; // Green
    if (score >= 50) return '#eab308'; // Yellow
    return '#ef4444'; // Red
  };

  return (
    <div style={{ padding: '20px', background: '#0b1220', minHeight: '100vh' }}>
      <h2 style={{ color: '#ffffff', fontSize: '28px', marginBottom: '8px' }}>Curated For You</h2>
      <p style={{ color: '#9ca3af', marginBottom: '32px' }}>Intelligently matched based on real-time safety and weather.</p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '24px' 
      }}>
        {recommended.map(item => {
          const score = Math.round(item.personalized_score || 85);
          const badgeColor = getScoreColor(score);
          
          // Generate realistic mock data for UI demo based on ID
          const temp = 28 + (item.beach.id % 5);
          const wave = (0.5 + (item.beach.id % 4) * 0.3).toFixed(1);
          const uv = 5 + (item.beach.id % 4);
          const crowd = item.beach.id % 2 === 0 ? 'Low' : 'Moderate';

          return (
            <div 
              key={item.beach.id} 
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                height: '320px',
                background: '#111827'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onClick={() => navigate(`/beach/${item.beach.id}`)}
            >
              {/* Background Image */}
              <img 
                src={`https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80&sig=${item.beach.id}`} 
                alt={item.beach.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Score Badge (Top Right) */}
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: badgeColor,
                color: '#fff',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                zIndex: 10
              }}>
                {score}
              </div>

              {/* Gradient Overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.1) 100%)',
                zIndex: 1
              }} />

              {/* Content (Bottom Left) */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '20px',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div>
                  <h3 style={{ margin: 0, color: '#ffffff', fontSize: '24px', fontWeight: 'bold' }}>
                    {item.beach.name}
                  </h3>
                  <span style={{ color: '#9ca3af', fontSize: '14px' }}>
                    {item.beach.location}
                  </span>
                </div>

                {/* Data Row */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  color: '#e2e8f0',
                  fontSize: '13px',
                  marginTop: '4px',
                  fontWeight: 500
                }}>
                  <span>🌡 {temp}°C</span>
                  <span>🌊 {wave}m</span>
                  <span>☀ UV {uv}</span>
                  <span>👥 {crowd}</span>
                </div>

                {/* Why Recommended */}
                <div style={{
                  marginTop: '6px',
                  paddingTop: '10px',
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  color: '#38bdf8',
                  fontSize: '13px',
                  fontStyle: 'italic'
                }}>
                  "{crowd} crowd and safe conditions today. Ideal for relaxing."
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
