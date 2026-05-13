import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import L from 'leaflet';
import { X, Cloud, Navigation, ShieldAlert, Route as RouteIcon } from 'lucide-react';

// Custom icons based on safety
const createDotIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-dot-icon',
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [14, 14] as L.PointExpression,
    iconAnchor: [7, 7] as L.PointExpression
  });
};

const greenIcon = createDotIcon('#22c55e'); // Tailwind green-500
const yellowIcon = createDotIcon('#eab308'); // Tailwind yellow-500
const redIcon = createDotIcon('#ef4444'); // Tailwind red-500

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
      .then(res => {
        setBeaches(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch beaches:', err);
        setLoading(false);
      });
  }, []);

  const handleMarkerClick = async (beach: any) => {
    setSelectedBeach(beach);
    setLiveData(null);
    try {
      const res = await apiClient.get(`/beach/${beach.id}/live-data`);
      const suitabilityRes = await apiClient.get(`/beach/${beach.id}/suitability`);
      setLiveData({ ...res.data, suitability: suitabilityRes.data });
    } catch (error) {
      console.error('Failed to fetch live data:', error);
    }
  };

  const getMarkerIcon = (beach: any) => {
    // In a real scenario we'd use suitability score here, but for now we'll mock based on ID
    if (beach.id % 3 === 0) return redIcon;
    if (beach.id % 2 === 0) return yellowIcon;
    return greenIcon;
  };

  const beachStateMap: Record<string, string> = {
    "Baga Beach": "Goa",
    "Calangute Beach": "Goa",
    "Anjuna Beach": "Goa",
    "Vagator Beach": "Goa",
    "Colva Beach": "Goa",
    "Gokarna Beach": "Karnataka",
    "Om Beach": "Karnataka",
    "Karwar Beach": "Karnataka",
    "Kudle Beach": "Karnataka",
    "Varkala Beach": "Kerala",
    "Kovalam Beach": "Kerala",
    "Marari Beach": "Kerala",
    "Bekal Beach": "Kerala",
    "Marina Beach": "Tamil Nadu",
    "Elliot's Beach": "Tamil Nadu",
    "Mahabalipuram Beach": "Tamil Nadu",
    "Alibaug Beach": "Maharashtra",
    "Tarkarli Beach": "Maharashtra",
    "Ganpatipule Beach": "Maharashtra",
    "Radhanagar Beach": "Andaman & Nicobar",
    "Elephant Beach": "Andaman & Nicobar",
    "Puri Beach": "Odisha",
    "Chandrabhaga Beach": "Odisha",
    "Digha Beach": "West Bengal",
    "Mandarmani Beach": "West Bengal"
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
        id: beach.id, 
        name: beach.name, 
        state: getStateForBeach(beach),
        lat: beach.coordinates?.coordinates[1] || 0, 
        lon: beach.coordinates?.coordinates[0] || 0 
      });
      localStorage.setItem('trip', JSON.stringify(trip));
      setTripBeaches(prev => [...prev, beach.id]);
    }
  };

  if (loading) {
    return <div className="loading">Loading Map...</div>;
  }

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%', borderRadius: '12px', zIndex: 0 }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">Carto</a>'
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

      {selectedBeach && (
        <div style={{
          position: 'absolute', top: 20, right: 20, width: '350px', background: '#1e293b', 
          borderRadius: '12px', padding: '20px', color: 'white', zIndex: 1000,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
        }}>
          <button onClick={() => setSelectedBeach(null)} style={{ position: 'absolute', top: 10, right: 10, background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={20} />
          </button>
          
          <h2 style={{ margin: '0 0 4px 0', color: '#38bdf8' }}>{selectedBeach.name}</h2>
          <p style={{ margin: '0 0 16px 0', color: '#94a3b8' }}>{selectedBeach.location}</p>

          {!liveData ? (
            <div>Loading live data...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Cloud size={18} color="#38bdf8" style={{ marginRight: '8px' }} />
                  <span>Weather</span>
                </div>
                <strong>{Math.round(liveData.weather.temperature)}°C, {Math.round(liveData.weather.wind_speed)} km/h</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Navigation size={18} color="#38bdf8" style={{ marginRight: '8px' }} />
                  <span>Marine</span>
                </div>
                <strong>Wave: {liveData.tide.wave_height.toFixed(1)}m, Tide: {liveData.tide.tide_level?.toFixed(1) || 0.5}m</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <ShieldAlert size={18} color={liveData.safety.rip_current_risk === 'High' ? '#ef4444' : '#10b981'} style={{ marginRight: '8px' }} />
                  <span>Safety</span>
                </div>
                <strong>{liveData.safety.rip_current_risk} Risk</strong>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {(() => {
                  const uv = liveData.weather.uv_index || 5;
                  const uvLabel = uv <= 2 ? 'Low' : uv <= 5 ? 'Moderate' : uv <= 7 ? 'High' : 'Extreme';
                  const uvColor = uv <= 2 ? '#10b981' : uv <= 5 ? '#f59e0b' : '#ef4444';
                  return (
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>UV Index: {uv}</div>
                      <span className="badge" style={{ background: `${uvColor}20`, color: uvColor }}>
                        {uvLabel}
                      </span>
                    </div>
                  );
                })()}

                {(() => {
                  const crowd = liveData.crowd?.level || (selectedBeach.id % 3 === 0 ? 'High' : selectedBeach.id % 2 === 0 ? 'Moderate' : 'Low');
                  const crowdColor = crowd === 'Low' ? '#10b981' : crowd === 'Moderate' || crowd === 'Medium' ? '#f59e0b' : '#ef4444';
                  const crowdIcon = crowd === 'Low' ? '🟢' : crowd === 'Moderate' || crowd === 'Medium' ? '🟡' : '🔴';
                  return (
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Crowd</div>
                      <span className="badge" style={{ background: `${crowdColor}20`, color: crowdColor }}>
                        {crowdIcon} {crowd === 'Medium' ? 'Moderate' : crowd}
                      </span>
                    </div>
                  );
                })()}
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px' }}>
                  <span>Suitability Score</span>
                  <strong style={{ color: liveData.suitability?.overall >= 70 ? '#10b981' : liveData.suitability?.overall >= 40 ? '#f59e0b' : '#ef4444' }}>
                    {Math.round(liveData.suitability?.overall || 50)}/100
                  </strong>
                </div>
                <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px' }}>
                  <div style={{ width: `${Math.round(liveData.suitability?.overall || 50)}%`, background: liveData.suitability?.overall >= 70 ? '#10b981' : liveData.suitability?.overall >= 40 ? '#f59e0b' : '#ef4444', height: '100%', borderRadius: '4px' }}></div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                {(() => {
                  const isAdded = tripBeaches.includes(selectedBeach.id);
                  return (
                    <button 
                      onClick={() => !isAdded && addToTrip(selectedBeach)}
                      style={{ flex: 1, background: isAdded ? '#10b981' : '#38bdf8', color: '#0f172a', border: 'none', padding: '10px', borderRadius: '8px', cursor: isAdded ? 'default' : 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                      {isAdded ? 'Added to Trip Planner' : <><RouteIcon size={18} style={{ marginRight: '8px' }} /> Add to Trip</>}
                    </button>
                  );
                })()}
                <button 
                  onClick={() => navigate(`/beach/${selectedBeach.id}`)}
                  style={{ flex: 1, background: '#334155', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
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
