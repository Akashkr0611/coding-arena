import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import L from 'leaflet';
import { X, Cloud, Navigation, ShieldAlert, Route as RouteIcon } from 'lucide-react';

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
  const [selectedBeach, setSelectedBeach] = useState<any>(null);
  const [liveData, setLiveData] = useState<any>(null);
  const [tripBeaches, setTripBeaches] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const trip = JSON.parse(localStorage.getItem('trip') || '[]');
    setTripBeaches(trip.map((t: any) => t.id));
    apiClient.get('/beaches')
      .then(res => { setBeaches(res.data); setLoading(false); })
      .catch(err => { console.error('Failed to fetch beaches:', err); setLoading(false); });
  }, []);

  const handleMarkerClick = async (beach: any) => {
    setSelectedBeach(beach);
    setLiveData(null);
    try {
      const res             = await apiClient.get(`/beach/${beach.id}/live-data`);
      const suitabilityRes  = await apiClient.get(`/beach/${beach.id}/suitability`);
      setLiveData({ ...res.data, suitability: suitabilityRes.data });
    } catch (error) {
      console.error('Failed to fetch live data:', error);
    }
  };

  const getMarkerIcon = (beach: any) => {
    if (beach.id % 3 === 0) return redIcon;
    if (beach.id % 2 === 0) return yellowIcon;
    return greenIcon;
  };

  const beachStateMap: Record<string, string> = {
    "Baga Beach": "Goa", "Calangute Beach": "Goa", "Anjuna Beach": "Goa",
    "Vagator Beach": "Goa", "Colva Beach": "Goa", "Gokarna Beach": "Karnataka",
    "Om Beach": "Karnataka", "Karwar Beach": "Karnataka", "Kudle Beach": "Karnataka",
    "Varkala Beach": "Kerala", "Kovalam Beach": "Kerala", "Marari Beach": "Kerala",
    "Bekal Beach": "Kerala", "Marina Beach": "Tamil Nadu", "Elliot's Beach": "Tamil Nadu",
    "Mahabalipuram Beach": "Tamil Nadu", "Alibaug Beach": "Maharashtra",
    "Tarkarli Beach": "Maharashtra", "Ganpatipule Beach": "Maharashtra",
    "Radhanagar Beach": "Andaman & Nicobar", "Elephant Beach": "Andaman & Nicobar",
    "Puri Beach": "Odisha", "Chandrabhaga Beach": "Odisha",
    "Digha Beach": "West Bengal", "Mandarmani Beach": "West Bengal"
  };

  const getStateForBeach = (beach: any) => {
    if (beach.state && beach.state !== 'Unknown') return beach.state;
    if (beach.location && beach.location !== 'Unknown') return beach.location;
    return beachStateMap[beach.name] || 'Unknown';
  };

  const addToTrip = (beach: any) => {
    const trip = JSON.parse(localStorage.getItem('trip') || '[]');
    if (!trip.find((t: any) => t.id === beach.id)) {
      trip.push({
        id: beach.id, name: beach.name,
        state: getStateForBeach(beach),
        lat: beach.coordinates?.coordinates[1] || 0,
        lon: beach.coordinates?.coordinates[0] || 0
      });
      localStorage.setItem('trip', JSON.stringify(trip));
      setTripBeaches(prev => [...prev, beach.id]);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        Loading Map...
      </div>
    );
  }

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      {/* Light OSM tile layer */}
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {beaches.map((beach) => {
          const coords = beach.coordinates?.coordinates || [73.7516, 15.5523];
          return (
            <Marker
              key={beach.id}
              position={[coords[1], coords[0]]}
              icon={getMarkerIcon(beach)}
              eventHandlers={{ click: () => handleMarkerClick(beach) }}
            />
          );
        })}
      </MapContainer>

      {/* Beach info popup */}
      {selectedBeach && (
        <div className="map-popup">
          <button
            onClick={() => setSelectedBeach(null)}
            style={{
              position: 'absolute', top: 14, right: 14,
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: '50%', width: 30, height: 30,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-secondary)'
            }}
          >
            <X size={16} />
          </button>

          <div className="map-popup-title">{selectedBeach.name}</div>
          <div className="map-popup-location">{selectedBeach.location}</div>

          {!liveData ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: 13 }}>
              <div className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
              Loading live data...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Weather row */}
              <div className="map-stat-row">
                <div className="map-stat-label">
                  <Cloud size={16} color="var(--teal)" />
                  Weather
                </div>
                <div className="map-stat-value">
                  {Math.round(liveData.weather.temperature)}°C · {Math.round(liveData.weather.wind_speed)} km/h
                </div>
              </div>

              {/* Marine row */}
              <div className="map-stat-row">
                <div className="map-stat-label">
                  <Navigation size={16} color="var(--teal)" />
                  Marine
                </div>
                <div className="map-stat-value">
                  Wave {liveData.tide.wave_height.toFixed(1)}m · Tide {(liveData.tide.tide_level ?? 0.5).toFixed(1)}m
                </div>
              </div>

              {/* Safety row */}
              <div className="map-stat-row">
                <div className="map-stat-label">
                  <ShieldAlert size={16} color={liveData.safety.rip_current_risk === 'High' ? 'var(--danger)' : 'var(--safe)'} />
                  Safety
                </div>
                <span className={`badge ${liveData.safety.rip_current_risk === 'High' ? 'badge-danger' : liveData.safety.rip_current_risk === 'Moderate' ? 'badge-mod' : 'badge-safe'}`}>
                  {liveData.safety.rip_current_risk} Risk
                </span>
              </div>

              {/* UV + Crowd */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {(() => {
                  const uv = liveData.weather.uv_index || 5;
                  const uvLabel = uv <= 2 ? 'Low' : uv <= 5 ? 'Moderate' : uv <= 7 ? 'High' : 'Extreme';
                  const uvClass = uv <= 2 ? 'badge-safe' : uv <= 5 ? 'badge-mod' : 'badge-danger';
                  return (
                    <div style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>UV Index · {uv}</div>
                      <span className={`badge ${uvClass}`}>{uvLabel}</span>
                    </div>
                  );
                })()}
                {(() => {
                  const crowd = liveData.crowd?.level || (selectedBeach.id % 3 === 0 ? 'High' : selectedBeach.id % 2 === 0 ? 'Moderate' : 'Low');
                  const crowdClass = crowd === 'Low' ? 'badge-safe' : crowd === 'High' ? 'badge-danger' : 'badge-mod';
                  return (
                    <div style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Crowd</div>
                      <span className={`badge ${crowdClass}`}>{crowd === 'Medium' ? 'Moderate' : crowd}</span>
                    </div>
                  );
                })()}
              </div>

              {/* Suitability bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Suitability Score</span>
                  <strong style={{ color: (liveData.suitability?.overall ?? 50) >= 70 ? 'var(--safe)' : (liveData.suitability?.overall ?? 50) >= 40 ? 'var(--moderate)' : 'var(--danger)' }}>
                    {Math.round(liveData.suitability?.overall ?? 50)}/100
                  </strong>
                </div>
                <div className="score-bar-track">
                  <div
                    className="score-bar-fill"
                    style={{
                      width: `${Math.round(liveData.suitability?.overall ?? 50)}%`,
                      background: (liveData.suitability?.overall ?? 50) >= 70 ? 'var(--safe)' : (liveData.suitability?.overall ?? 50) >= 40 ? 'var(--moderate)' : 'var(--danger)'
                    }}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                {(() => {
                  const isAdded = tripBeaches.includes(selectedBeach.id);
                  return (
                    <button
                      className={`btn ${isAdded ? 'btn-ghost' : 'btn-primary'}`}
                      style={{ flex: 1 }}
                      onClick={() => !isAdded && addToTrip(selectedBeach)}
                      disabled={isAdded}
                    >
                      {isAdded ? '✓ In Trip' : <><RouteIcon size={15} /> Add to Trip</>}
                    </button>
                  );
                })()}
                <button
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => navigate(`/beach/${selectedBeach.id}`)}
                >
                  Details
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
