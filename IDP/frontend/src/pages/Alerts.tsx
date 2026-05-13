import { useEffect, useState } from 'react';
import { AlertTriangle, Info, Sun, Bell } from 'lucide-react';
import apiClient from '../api/client';

export default function Alerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/alerts/1')
      .then(res => { setAlerts(res.data); setLoading(false); })
      .catch(err => { console.error('Failed to fetch alerts:', err); setLoading(false); });
  }, []);

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'danger':  return { iconClass: 'alert-icon-danger',  icon: <AlertTriangle size={20} color="var(--danger)" />,   badgeClass: 'badge-danger', label: 'Danger'  };
      case 'warning': return { iconClass: 'alert-icon-warning', icon: <Sun size={20} color="var(--moderate)" />,           badgeClass: 'badge-mod',    label: 'Warning' };
      case 'info':    return { iconClass: 'alert-icon-info',    icon: <Info size={20} color="var(--info)" />,              badgeClass: 'badge-info',   label: 'Info'    };
      default:        return { iconClass: 'alert-icon-info',    icon: <Info size={20} color="var(--text-muted)" />,        badgeClass: 'badge-teal',   label: 'Notice'  };
    }
  };

  if (loading) {
    return (
      <div className="loading" style={{ paddingTop: 80 }}>
        <div className="loading-spinner" />
        Loading alerts...
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 className="header-title">Active Alerts</h1>
        <p className="header-subtitle">Real-time beach safety notifications across India</p>
      </div>

      {/* Summary banner */}
      {alerts.length > 0 && (
        <div style={{
          background: 'rgba(239,68,68,0.06)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 'var(--radius)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 24
        }}>
          <Bell size={20} color="var(--danger)" />
          <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>
            <strong style={{ color: 'var(--danger)' }}>{alerts.length} active alert{alerts.length !== 1 ? 's' : ''}</strong> — please review before visiting these beaches.
          </span>
        </div>
      )}

      {/* Alert list */}
      {alerts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{
            width: 64, height: 64,
            background: 'rgba(34,197,94,0.1)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Info size={28} color="var(--safe)" />
          </div>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: 8 }}>All Clear!</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No active alerts at the moment. All beaches are reporting normal conditions.</p>
        </div>
      ) : (
        alerts.map(alert => {
          const style = getAlertStyle(alert.type);
          return (
            <div key={alert.id} className="alert-item">
              <div className={`alert-icon-wrap ${style.iconClass}`}>
                {style.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <strong style={{ fontSize: 15, color: 'var(--text-primary)' }}>Baga Beach</strong>
                    <span className={`badge ${style.badgeClass}`}>{style.label}</span>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0, lineHeight: 1.5 }}>
                  {alert.message}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
