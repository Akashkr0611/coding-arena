import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';

import beachesJson from '../data/beaches.json';
import Loader from '../components/Loader';

const stateColors: Record<string, string> = {
  "Goa": "#e74c3c",
  "Karnataka": "#27ae60",
  "Kerala": "#f39c12",
  "Maharashtra": "#2980b9",
  "Tamil Nadu": "#8e44ad",
  "Andhra Pradesh": "#f1c40f",
  "Odisha": "#e67e22",
  "West Bengal": "#1abc9c",
  "Gujarat": "#d35400",
  "Andaman": "#2c3e50",
  "Daman": "#7f8c8d",
  "Puducherry": "#c0392b"
};

const getMarkerIcon = (state: string) => {
  const color = stateColors[state] || "#95a5a6";

  return L.divIcon({
    className: "",
    html: `<div style="
      background:${color};
      width:14px;
      height:14px;
      border-radius:50%;
      border:2px solid white;
    "></div>`
  });
};

export default function Home() {
  const [beaches, setBeaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedBeach, setSelectedBeach] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  
  const navigate = useNavigate();

  useEffect(() => {
    setBeaches(beachesJson);
    setLoading(false);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      });
    }
    
  }, []);

  const handleMarkerClick = (beach: any) => {
    setSelectedBeach(beach);
  };

  const handleViewDetails = (beach: any) => {
    navigate(`/beach/${beach.id}`, { state: beach });
  };

  const addToTrip = (beach: any) => {
    const trip = JSON.parse(localStorage.getItem('trip') || '[]');
    if (!trip.find((t: any) => t.id === beach.id)) {
      trip.push({
        id: beach.id, name: beach.name,
        state: beach.state,
        lat: beach.lat,
        lon: beach.lon
      });
      localStorage.setItem('trip', JSON.stringify(trip));
      // Option: show a toast or alert here
      alert("Added to Trip!");
    } else {
      alert("Already in Trip!");
    }
  };



  if (loading) {
    return <Loader />;
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
            icon={getMarkerIcon(beach.state)}
            eventHandlers={{ click: () => handleMarkerClick(beach) }}
          >
            <Popup>
              <div className="popup-box">
                <h4>{beach.name}</h4>
                <p>{beach.state}</p>
                <button className="btn btn-secondary" onClick={() => handleViewDetails(beach)}>
                  View Details
                </button>
                <button className="btn btn-primary" onClick={() => addToTrip(beach)}>
                  Add to Trip
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {selectedBeach && userLocation && (
          <Polyline 
            positions={[userLocation, [selectedBeach.lat, selectedBeach.lon]]} 
            color="red" 
            weight={3}
            opacity={0.8}
            dashArray="5, 10"
          />
        )}
      </MapContainer>
    </div>


  );
}
