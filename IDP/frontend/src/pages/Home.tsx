import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import apiClient from '../api/client';
import L from 'leaflet';
import { X, Cloud, Route as RouteIcon } from 'lucide-react';
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
  const [selectedBeach, setSelectedBeach] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherError, setWeatherError] = useState<boolean>(false);
  const [tripBeaches, setTripBeaches] = useState<number[]>([]);

  const [selectedState, setSelectedState] = useState<string>('All');
  
  const [showDetails, setShowDetails] = useState(false);
  const [detailsData, setDetailsData] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const trip = JSON.parse(localStorage.getItem('trip') || '[]');
    setTripBeaches(trip.map((t: any) => t.id));
    setBeaches(beachesJson);
    setLoading(false);
  }, []);

  const handleMarkerClick = async (beach: any) => {
    setSelectedBeach(beach);
    setWeatherData(null);
    setWeatherError(false);
    setShowDetails(false);
    setDetailsData(null);
    setLoadingDetails(false);
    console.log("Clicked beach:", beach);
    console.log("Beach coords:", beach.name, beach.lat, beach.lon);
    console.log("Fetching weather for:", beach.lat, beach.lon);
    try {
      const res = await apiClient.get(`/weather?lat=${beach.lat}&lon=${beach.lon}`);
      if (!res.data || res.data.error) {
        setWeatherError(true);
      } else {
        setWeatherData(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      setWeatherError(true);
    }
  };

  const handleViewDetails = async () => {
    if (!selectedBeach) return;
    setLoadingDetails(true);
    try {
      const res = await apiClient.get(`/weather/details?lat=${selectedBeach.lat}&lon=${selectedBeach.lon}`);
      setDetailsData(res.data);
      setShowDetails(true);
    } catch (error) {
      console.error('Failed to fetch weather details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const getMarkerIcon = (beach: any) => {
    if (beach.popularity === 'high') return redIcon;
    if (beach.popularity === 'medium') return yellowIcon;
    return greenIcon;
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
          <div className="map-popup-location">{selectedBeach.state}</div>

          {!weatherData && !weatherError ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: 13 }}>
              <div className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
              Loading live weather...
            </div>
          ) : weatherError ? (
            <div style={{ padding: '10px 0', color: 'var(--danger)', fontSize: 14 }}>
              Weather unavailable
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <div className="map-stat-row">
                <div className="map-stat-label">
                  <Cloud size={16} color="var(--teal)" />
                  Temp & Condition
                </div>
                <div className="map-stat-value" style={{ textTransform: 'capitalize' }}>
                  {Math.round(weatherData.temperature)}°C · {weatherData.condition}
                </div>
              </div>

              {!showDetails && !loadingDetails && (
                <button 
                  className="btn btn-secondary" 
                  onClick={handleViewDetails}
                  style={{ width: '100%', padding: '6px', marginTop: '4px' }}
                >
                  View Details
                </button>
              )}

              {loadingDetails && (
                 <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: '13px', marginTop: '8px' }}>
                    <div className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                    Loading details...
                 </div>
              )}

              {showDetails && detailsData && (
                <div style={{ background: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '13px', marginTop: '5px', color: 'var(--text-secondary)' }}>
                  <p style={{ margin: '4px 0' }}><strong style={{color: 'var(--text-primary)'}}>Wind:</strong> {detailsData.windSpeed} m/s</p>
                  <p style={{ margin: '4px 0' }}><strong style={{color: 'var(--text-primary)'}}>Humidity:</strong> {detailsData.humidity}%</p>
                  <p style={{ margin: '4px 0' }}><strong style={{color: 'var(--text-primary)'}}>Pressure:</strong> {detailsData.pressure} hPa</p>
                  <p style={{ margin: '4px 0' }}><strong style={{color: 'var(--text-primary)'}}>Visibility:</strong> {detailsData.visibility} m</p>
                  <p style={{ margin: '4px 0' }}><strong style={{color: 'var(--text-primary)'}}>Feels Like:</strong> {detailsData.feelsLike}°C</p>
                  <p style={{ margin: '4px 0' }}><strong style={{color: 'var(--text-primary)'}}>Wave Height:</strong> {detailsData.waveHeight} m</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button
                  className={`btn ${tripBeaches.includes(selectedBeach.id) ? 'btn-ghost' : 'btn-primary'}`}
                  style={{ flex: 1 }}
                  onClick={() => !tripBeaches.includes(selectedBeach.id) && addToTrip(selectedBeach)}
                  disabled={tripBeaches.includes(selectedBeach.id)}
                >
                  {tripBeaches.includes(selectedBeach.id) ? '✓ In Trip' : <><RouteIcon size={15} /> Add to Trip</>}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
