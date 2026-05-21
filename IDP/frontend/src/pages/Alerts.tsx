import { useEffect, useState } from 'react';
import { AlertTriangle, Info, Sun, Bell } from 'lucide-react';
import beachesJson from '../data/beaches.json';

export const generateAlerts = (beach: any) => {
  const alerts = [];
  const wave = beach.waveHeight || (0.5 + (beach.id % 4) * 0.3);
  const temp = beach.temp || 28 + (beach.id % 5);
  const wind = beach.windSpeed || 5 + (beach.id % 3) * 2;

  if (wave > 1.5) {
    alerts.push({
      type: "High Waves",
      severity: "High",
      message: "Avoid swimming"
    });
  }
  if (temp > 35) {
    alerts.push({
      type: "Heat Alert",
      severity: "Medium",
      message: "Stay hydrated"
    });
  }
  if (wind > 10) {
    alerts.push({
      type: "High Wind",
      severity: "Medium",
      message: "Be cautious"
    });
  }
  return alerts;
};

export default function Alerts() {
  const [alertsData, setAlertsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!beachesJson || beachesJson.length === 0) return;

    const allAlerts = beachesJson.map((b: any) => ({
      beachName: b.name,
      alerts: generateAlerts(b)
    }));

    setAlertsData(allAlerts);
    setLoading(false);
  }, []);

  const getAlertStyle = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'high':  return { iconClass: 'alert-icon-danger',  icon: <AlertTriangle size={20} color="var(--danger)" />,   badgeClass: 'badge-danger', label: 'High'  };
      case 'medium': return { iconClass: 'alert-icon-warning', icon: <Sun size={20} color="var(--moderate)" />,           badgeClass: 'badge-mod',    label: 'Medium' };
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
      {alertsData.some(a => a.alerts.length > 0) && (
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
            <strong style={{ color: 'var(--danger)' }}>
              {alertsData.reduce((acc, curr) => acc + curr.alerts.length, 0)} active alert{alertsData.reduce((acc, curr) => acc + curr.alerts.length, 0) !== 1 ? 's' : ''}
            </strong> — please review before visiting these beaches.
          </span>
        </div>
      )}

      {/* Alert list */}
      {alertsData.filter(a => a.alerts.length > 0).length === 0 ? (
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
        alertsData
          .filter(a => a.alerts.length > 0)
          .map(item => (
            <div key={item.beachName} className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, marginBottom: 12, color: 'var(--text-primary)' }}>{item.beachName}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {item.alerts.map((alert: any, index: number) => {
                  const style = getAlertStyle(alert.severity);
                  return (
                    <div key={index} className="alert-item" style={{ border: 'none', padding: 0, background: 'transparent' }}>
                      <div className={`alert-icon-wrap ${style.iconClass}`}>
                        {style.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <strong style={{ fontSize: 15, color: 'var(--text-primary)' }}>{alert.type}</strong>
                            <span className={`badge ${style.badgeClass}`}>{style.label}</span>
                          </div>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0, lineHeight: 1.5 }}>
                          {alert.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
      )}
    </div>
  );
}
