import { useState, useEffect } from 'react';
import { Sliders, Save } from 'lucide-react';

export default function Preferences() {
  const [preferences, setPreferences] = useState({
    lowCrowd: false,
    scenic: false,
    adventure: false,
    safe: false
  });

  useEffect(() => {
    const saved = localStorage.getItem("userPreferences");
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  }, []);

  const handleChange = (field: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = () => {
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
    alert("Preferences saved successfully");
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
        <div style={getButtonStyle(preferences.lowCrowd)} onClick={() => handleChange('lowCrowd')} className={preferences.lowCrowd ? "active" : ""}>
          🧘 Low Crowd
        </div>
        <div style={getButtonStyle(preferences.scenic)} onClick={() => handleChange('scenic')} className={preferences.scenic ? "active" : ""}>
          🌅 Scenic
        </div>
        <div style={getButtonStyle(preferences.adventure)} onClick={() => handleChange('adventure')} className={preferences.adventure ? "active" : ""}>
          🏄 Adventure
        </div>
        <div style={getButtonStyle(preferences.safe)} onClick={() => handleChange('safe')} className={preferences.safe ? "active" : ""}>
          🛟 Safe
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={handleSave}
          style={{ padding: '16px 32px', borderRadius: '12px', background: 'var(--teal)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}
        >
          <Save size={20} /> Save Preferences
        </button>
      </div>
    </div>
  );
}
