import { useState, useEffect } from 'react';
import { Save, Sliders, CheckCircle } from 'lucide-react';

export default function Preferences() {
  const [preferences, setPreferences] = useState({
    state: '',
    crowd: '',
    travelType: '',
    bestTime: ''
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("userPreferences");
    if (stored) {
      setPreferences(JSON.parse(stored));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page-wrapper" style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={24} color="var(--teal)" /> Preferences
        </h1>
        <p className="header-subtitle">Customize your beach recommendations</p>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Preferred State</label>
          <select 
            name="state" 
            value={preferences.state} 
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text-primary)' }}
          >
            <option value="">Any</option>
            <option value="Goa">Goa</option>
            <option value="Kerala">Kerala</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Crowd Level</label>
          <select 
            name="crowd" 
            value={preferences.crowd} 
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text-primary)' }}
          >
            <option value="">Any</option>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Travel Type</label>
          <select 
            name="travelType" 
            value={preferences.travelType} 
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text-primary)' }}
          >
            <option value="">Any</option>
            <option value="relaxation">Relaxation</option>
            <option value="adventure">Adventure</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Best Time</label>
          <select 
            name="bestTime" 
            value={preferences.bestTime} 
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text-primary)' }}
          >
            <option value="">Any</option>
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
          </select>
        </div>

        <button 
          onClick={handleSave} 
          className="btn" 
          style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: 'var(--teal)', color: 'white', borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer', fontWeight: 600 }}
        >
          <Save size={18} /> Save Preferences
        </button>

        {saved && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--safe)', marginTop: '8px', fontWeight: 500 }}>
            <CheckCircle size={18} /> Preferences saved successfully!
          </div>
        )}
      </div>
    </div>
  );
}
