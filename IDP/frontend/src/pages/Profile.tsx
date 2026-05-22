import { useEffect, useState } from 'react';
import { Shield, Image as ImageIcon, VolumeX, Waves, Save } from 'lucide-react';
import apiClient from '../api/client';
import Loader from '../components/Loader';

const prefItems = [
  {
    key: 'safe' as const,
    icon: <Shield size={20} color="var(--moderate)" />,
    iconBg: 'rgba(245,158,11,0.1)',
    label: 'Safe Beaches',
    sub: 'Lifeguard present, low rip current risk'
  },
  {
    key: 'scenic' as const,
    icon: <ImageIcon size={20} color="var(--safe)" />,
    iconBg: 'rgba(34,197,94,0.1)',
    label: 'Scenic Beaches',
    sub: 'Clear weather, sunrise/sunset views'
  },
  {
    key: 'quiet' as const,
    icon: <VolumeX size={20} color="var(--info)" />,
    iconBg: 'rgba(59,130,246,0.1)',
    label: 'Quiet Beaches',
    sub: 'Low crowd density, peaceful atmosphere'
  },
  {
    key: 'adventure' as const,
    icon: <Waves size={20} color="var(--teal)" />,
    iconBg: 'rgba(20,184,166,0.1)',
    label: 'Adventure Beaches',
    sub: 'Higher waves, surfing & water sports'
  },
];

export default function Profile() {
  const [preferences, setPreferences] = useState({
    safe: false, scenic: false, quiet: false, adventure: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiClient.get('/user/1')
      .then(res => {
        if (res.data?.preferences) {
          setPreferences(prev => ({ ...prev, ...res.data.preferences }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const togglePref = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaving(true);
    apiClient.post('/user/preferences', { user_id: 1, preferences })
      .then(() => { setSaving(false); setSaved(true); })
      .catch(() => { setSaving(false); alert('Failed to save preferences.'); });
  };

  if (loading) {
    return <Loader />;
  }

  const selectedCount = Object.values(preferences).filter(Boolean).length;

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 className="header-title">Profile &amp; Preferences</h1>
        <p className="header-subtitle">Customize your beach recommendations based on what matters to you</p>
      </div>

      {/* Summary chip */}
      {selectedCount > 0 && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(20,184,166,0.1)',
          border: '1px solid rgba(20,184,166,0.25)',
          borderRadius: 20, padding: '6px 14px',
          fontSize: 13, color: 'var(--teal)', fontWeight: 600,
          marginBottom: 20
        }}>
          ✓ {selectedCount} preference{selectedCount !== 1 ? 's' : ''} selected
        </div>
      )}

      {/* Preferences card */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          Beach Preferences
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
          We'll use these to recommend the best beaches for you.
        </p>

        {prefItems.map(({ key, icon, iconBg, label, sub }) => (
          <div key={key} className="toggle-row">
            <div className="toggle-label">
              <div style={{ width: 38, height: 38, background: iconBg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {icon}
              </div>
              <div>
                <div>{label}</div>
                <div className="toggle-label-sub">{sub}</div>
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={preferences[key]}
                onChange={() => togglePref(key)}
              />
              <span className="switch-slider" />
            </label>
          </div>
        ))}
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="btn btn-primary"
        style={{ width: '100%', padding: '14px', fontSize: 15, borderRadius: 'var(--radius)' }}
      >
        {saving ? (
          <>
            <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            Saving...
          </>
        ) : saved ? (
          '✓ Preferences Saved!'
        ) : (
          <><Save size={16} /> Save Preferences</>
        )}
      </button>
    </div>
  );
}
