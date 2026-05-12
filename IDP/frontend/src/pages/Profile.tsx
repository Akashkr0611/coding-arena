import { useEffect, useState } from 'react';
import { Shield, Image as ImageIcon, VolumeX, Waves } from 'lucide-react';
import apiClient from '../api/client';

export default function Profile() {
  const [preferences, setPreferences] = useState({
    safe: false,
    scenic: false,
    quiet: false,
    adventure: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiClient.get('/user/1')
      .then(res => {
        if (res.data && res.data.preferences) {
          setPreferences({ ...preferences, ...res.data.preferences });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch user preferences:', err);
        setLoading(false);
      });
  }, []);

  const toggleSwitch = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaving(true);
    apiClient.post('/user/preferences', { user_id: 1, preferences })
      .then(() => {
        setSaving(false);
        alert('Preferences updated successfully!');
      })
      .catch(err => {
        console.error('Failed to save preferences:', err);
        setSaving(false);
        alert('Failed to save preferences.');
      });
  };

  if (loading) return <div className="loading">Loading Profile...</div>;

  return (
    <div>
      <h2 className="header-title">Profile & Preferences</h2>
      <p className="header-subtitle">Customize your beach recommendations</p>
      
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Shield color="#f59e0b" style={{ marginRight: '12px' }} />
            <span>Safe (Lifeguard, Low Risk)</span>
          </div>
          <input type="checkbox" checked={preferences.safe} onChange={() => toggleSwitch('safe')} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ImageIcon color="#10b981" style={{ marginRight: '12px' }} />
            <span>Scenic (Clear Weather, Sun)</span>
          </div>
          <input type="checkbox" checked={preferences.scenic} onChange={() => toggleSwitch('scenic')} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <VolumeX color="#6366f1" style={{ marginRight: '12px' }} />
            <span>Quiet (Low Crowd)</span>
          </div>
          <input type="checkbox" checked={preferences.quiet} onChange={() => toggleSwitch('quiet')} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Waves color="#3b82f6" style={{ marginRight: '12px' }} />
            <span>Adventure (Higher Waves)</span>
          </div>
          <input type="checkbox" checked={preferences.adventure} onChange={() => toggleSwitch('adventure')} />
        </div>
      </div>

      <button 
        onClick={handleSave} 
        disabled={saving}
        style={{ width: '100%', padding: '16px', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
      >
        {saving ? 'Saving...' : 'Save Preferences'}
      </button>
    </div>
  );
}
