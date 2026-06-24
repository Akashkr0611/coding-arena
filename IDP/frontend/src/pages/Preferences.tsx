import { Sliders, Users, Camera, Compass, Shield } from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';

export default function Preferences() {
  const { preferences, setPreferences } = usePreferences();

  const handleChange = (field: string) => {
    setPreferences((prev: any) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const getButtonStyle = (active: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '20px',
    borderRadius: '16px',
    border: active ? '2px solid var(--teal)' : '2px solid var(--border)',
    background: active ? 'rgba(11, 191, 169, 0.1)' : 'var(--card-bg)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '16px',
    transition: 'all 0.2s ease',
    boxShadow: active ? '0 0 15px rgba(11, 191, 169, 0.2)' : 'none',
    width: '100%'
  });

  return (
    <div className="page-wrapper" style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 className="header-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Sliders size={28} color="var(--teal)" /> Preferences
        </h1>
        <p className="header-subtitle">Customize your perfect beach getaway</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <button style={getButtonStyle(preferences.lowCrowd)} onClick={() => handleChange('lowCrowd')}>
          <Users size={22} color={preferences.lowCrowd ? "var(--teal)" : "var(--text-secondary)"} />
          Low Crowd
        </button>
        <button style={getButtonStyle(preferences.scenic)} onClick={() => handleChange('scenic')}>
          <Camera size={22} color={preferences.scenic ? "var(--teal)" : "var(--text-secondary)"} />
          Scenic
        </button>
        <button style={getButtonStyle(preferences.adventure)} onClick={() => handleChange('adventure')}>
          <Compass size={22} color={preferences.adventure ? "var(--teal)" : "var(--text-secondary)"} />
          Adventure
        </button>
        <button style={getButtonStyle(preferences.safe)} onClick={() => handleChange('safe')}>
          <Shield size={22} color={preferences.safe ? "var(--teal)" : "var(--text-secondary)"} />
          Safe
        </button>
      </div>
    </div>
  );
}
