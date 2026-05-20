import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import beachesJson from '../data/beaches.json';

const createDotIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-dot-icon',
    html: `<div style="background-color:${color};width:14px;height:14px;border-radius:50%;border:2.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.25);"></div>`,
    iconSize: [14, 14] as L.PointExpression,
    iconAnchor: [7, 7] as L.PointExpression
  });
};

const greenIcon  = createDotIcon('#22C55E');
const yellowIcon = createDotIcon('#F59E0B');
const redIcon    = createDotIcon('#EF4444');

export default function Home() {
  const [beaches, setBeaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>('All');
  
  const navigate = useNavigate();

  useEffect(() => {
    setBeaches(beachesJson);
    setLoading(false);
  }, []);

  const handleMarkerClick = (beach: any) => {
    navigate(`/beach/${beach.id}`, { state: beach });
  };

  const getMarkerIcon = (beach: any) => {
    if (beach.popularity === 'high') return redIcon;
    if (beach.popularity === 'medium') return yellowIcon;
    return greenIcon;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        Loading Map...
      </div>
    );
  }

  const statesList = ['All', ...new Set(beaches.map((b: any) => b.state))];
  const filteredBeaches = selectedState === 'All' ? beaches : beaches.filter((b: any) => b.state === selectedState);

  const indiaBounds = [
    [6.5, 68.0],
    [37.5, 97.5]
  ] as L.LatLngBoundsExpression;

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 1000, background: 'var(--bg)', padding: '6px 12px', borderRadius: 'var(--radius)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Filter State:</span>
        <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border)', outline: 'none', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: '13px' }}>
          {statesList.map(s => <option key={s as string} value={s as string}>{s as string}</option>)}
        </select>
      </div>
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        minZoom={5}
        maxZoom={12}
        maxBounds={indiaBounds}
        maxBoundsViscosity={1.0}
        bounceAtZoomLimits={false}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {filteredBeaches.map((beach) => (
          <Marker
            key={beach.id}
            position={[beach.lat, beach.lon]}
            icon={getMarkerIcon(beach)}
            eventHandlers={{ click: () => handleMarkerClick(beach) }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
