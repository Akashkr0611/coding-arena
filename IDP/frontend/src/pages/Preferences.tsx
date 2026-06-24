import { Sliders } from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';

export default function Preferences() {
  const { preferences, setPreferences } = usePreferences();

  const handleChange = (field: string) => {
    setPreferences((prev: any) => ({
      ...prev,
      [field]: !prev[field]
    }));
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
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 500 }}>
          <input type="checkbox" checked={preferences.lowCrowd} onChange={() => handleChange('lowCrowd')} style={{ transform: 'scale(1.2)' }} />
          Low Crowd
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 500 }}>
          <input type="checkbox" checked={preferences.scenic} onChange={() => handleChange('scenic')} style={{ transform: 'scale(1.2)' }} />
          Scenic
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 500 }}>
          <input type="checkbox" checked={preferences.adventure} onChange={() => handleChange('adventure')} style={{ transform: 'scale(1.2)' }} />
          Adventure
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 500 }}>
          <input type="checkbox" checked={preferences.safe} onChange={() => handleChange('safe')} style={{ transform: 'scale(1.2)' }} />
          Safe
        </label>
      </div>
    </div>
  );
}
