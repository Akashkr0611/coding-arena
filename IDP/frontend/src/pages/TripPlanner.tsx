import { useState, useEffect } from 'react';
import { Trash2, Download, Route, BarChart2, Lightbulb, Search } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import apiClient from '../api/client';
import beachesJson from '../data/beaches.json';

function calculateDistance(lat1Raw: number, lon1Raw: number, lat2Raw: number, lon2Raw: number) {
  const lat1 = Number(lat1Raw);
  const lon1 = Number(lon1Raw);
  const lat2 = Number(lat2Raw);
  const lon2 = Number(lon2Raw);

  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function sortTripByDistance(trip: any[]) {
  if (trip.length <= 1) return trip;
  const sorted = [trip[0]];
  const remaining = trip.slice(1);
  while (remaining.length > 0) {
    const last = sorted[sorted.length - 1];
    let nearestIdx = 0;
    let minDist = calculateDistance(last.lat, last.lon, remaining[0].lat, remaining[0].lon);
    for (let i = 1; i < remaining.length; i++) {
      const d = calculateDistance(last.lat, last.lon, remaining[i].lat, remaining[i].lon);
      if (d < minDist) { minDist = d; nearestIdx = i; }
    }
    sorted.push(remaining[nearestIdx]);
    remaining.splice(nearestIdx, 1);
  }
  return sorted;
}

const parameters = [
  { label: 'Suitability Score', key: 'Suitability Score', max: 100, color: '#14B8A6' },
  { label: 'Temperature (°C)',  key: 'Temperature',       max: 50,  color: '#F59E0B' },
  { label: 'Wind Speed (km/h)', key: 'Wind Speed',        max: 50,  color: '#22C55E' },
  { label: 'Wave Height (m)',   key: 'Wave Height',       max: 5,   color: '#EF4444' },
  { label: 'Tide Level (m)',    key: 'Tide Level',        max: 5,   color: '#8B5CF6' },
  { label: 'UV Index',          key: 'UV Index',          max: 15,  color: '#EC4899' },
  { label: 'None',              key: 'None',              max: 1,   color: 'transparent' },
];

export default function TripPlanner() {
  const [trip, setTrip] = useState<any[]>([]);
  const [param1, setParam1] = useState('Suitability Score');
  const [param2, setParam2] = useState('Temperature');
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [nearbyBeaches, setNearbyBeaches] = useState<any[]>([]);
  const [loadingNearby, setLoadingNearby] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('trip') || '[]');
    setTrip(sortTripByDistance(saved));

    if (navigator.geolocation) {
      setLoadingNearby(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setUserLocation({ lat, lon });
          findNearbyBeaches(lat, lon);
        },
        (error) => {
          console.error("Location error:", error);
          setLocationError("Enable location to see nearby beaches");
          setLoadingNearby(false);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  const addToTrip = (beach: any) => {
    if (!trip.find((t: any) => t.id === beach.id)) {
      const updated = [...trip, beach];
      const sorted = sortTripByDistance(updated);
      setTrip(sorted);
      localStorage.setItem('trip', JSON.stringify(sorted));
    }
  };

  const removeBeach = (id: number) => {
    const updated = trip.filter(t => t.id !== id);
    setTrip(updated);
    localStorage.setItem('trip', JSON.stringify(updated));
  };

  const findNearbyBeaches = async (userLat: number, userLon: number) => {
    try {
      const lat1 = Number(userLat);
      const lon1 = Number(userLon);

      const beachesWithDist = beachesJson.map((b: any) => ({
        ...b,
        haversineDist: calculateDistance(lat1, lon1, b.lat, b.lon)
      })).sort((a: any, b: any) => a.haversineDist - b.haversineDist).slice(0, 5);
      
      console.log("User:", lat1, lon1);
      console.log("Nearest beaches:", beachesWithDist);
      
      const routesPromises = beachesWithDist.map(async (beach: any) => {
        try {
          const routeRes = await apiClient.post('/route', {
            user_lat: userLat, user_lon: userLon,
            beach_lat: beach.lat, beach_lon: beach.lon
          });
          return { ...beach, travelDist: routeRes.data.distance, travelTime: routeRes.data.duration };
        } catch (err) {
          return { ...beach, travelDist: beach.haversineDist.toFixed(1), travelTime: 'N/A' };
        }
      });
      
      const finalNearby = await Promise.all(routesPromises);
      setNearbyBeaches(finalNearby);
    } catch (error) {
      console.error('Failed to find beaches:', error);
    } finally {
      setLoadingNearby(false);
    }
  };

  const getParamData = (beach: any, key: string) => {
    const isRisky = beach.id % 3 === 0;
    switch (key) {
      case 'Suitability Score': return isRisky ? 45 : 85;
      case 'Temperature':       return 28 + (beach.id % 5);
      case 'Wind Speed':        return 10 + (beach.id % 15);
      case 'Wave Height':       return isRisky ? 2.5 : 1.2;
      case 'Tide Level':        return 1.5;
      case 'UV Index':          return 5 + (beach.id % 3);
      default:                  return 0;
    }
  };

  const exportPDF = async () => {
    window.scrollTo(0, 0);
    const element = document.getElementById("trip-planner-page");
    if (!element) return;
    
    // Briefly hide export button for cleaner PDF
    const exportBtn = document.getElementById("export-btn");
    if (exportBtn) exportBtn.style.display = 'none';

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("trip-plan.pdf");
    } catch (err) {
      console.error("PDF Export failed", err);
    } finally {
      if (exportBtn) exportBtn.style.display = 'flex';
    }
  };

  const p1cfg = parameters.find(p => p.key === param1) || parameters[0];
  const p2cfg = parameters.find(p => p.key === param2) || parameters[6];

  const crowdBadge = (beach: any) => {
    const c = beach.id % 3 === 0 ? 'High' : beach.id % 2 === 0 ? 'Moderate' : 'Low';
    const cls = c === 'High' ? 'badge-danger' : c === 'Moderate' ? 'badge-mod' : 'badge-safe';
    return <span className={`badge ${cls}`}>{c}</span>;
  };

  const uvBadge = (val: number) => {
    const cls = val > 7 ? 'badge-danger' : val > 5 ? 'badge-mod' : 'badge-safe';
    return <span className={`badge ${cls}`}>{val} {val > 7 ? '· Extreme' : val > 5 ? '· High' : '· Mod'}</span>;
  };

  const getTravelDetails = (distance: number) => {
    if (distance < 100) return { mode: 'Car 🚗', time: Math.max(1, Math.round(distance / 50)) };
    if (distance <= 500) return { mode: 'Train 🚆', time: Math.max(1, Math.round(distance / 80)) };
    return { mode: 'Flight ✈️', time: Math.max(1, Math.round(distance / 600)) };
  };

  return (
    <div id="trip-planner-page" className="page-wrapper" style={{ background: 'var(--bg-default)', padding: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="header-title">Intelligent Trip Planner</h1>
          <p className="header-subtitle">Discover nearby beaches and get smart travel routes instantly</p>
        </div>
        <button
          id="export-btn"
          className="btn btn-primary"
          onClick={exportPDF}
          disabled={trip.length === 0}
          style={{ gap: 8 }}
        >
          <Download size={16} /> Export Trip Plan
        </button>
      </div>

      {/* ── User Location Search ── */}
      <div className="card" style={{ marginBottom: 20, padding: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Search size={18} color="var(--teal)" /> Find Nearest Beaches
        </h3>
        
        {loadingNearby && (
          <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>
             Locating you and finding nearest beaches...
          </div>
        )}

        {locationError && !loadingNearby && (
          <div style={{ color: 'var(--danger)', fontSize: 14, background: 'rgba(239,68,68,0.1)', padding: '10px 14px', borderRadius: 6 }}>
            {locationError}
          </div>
        )}
        
        {nearbyBeaches.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>Top 5 Closest Recommendations</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {nearbyBeaches.map((beach, idx) => (
                <div key={beach.id} style={{
                  padding: 14, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'rgba(0,0,0,0.02)',
                  position: 'relative'
                }}>
                  {idx === 0 && <span style={{ position: 'absolute', top: -10, right: 10, background: 'var(--teal)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>Closest Match</span>}
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{beach.name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 10 }}>{beach.state || beach.location}</div>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 13 }}>
                    <div><strong>Distance:</strong> {beach.travelDist} km</div>
                    <div><strong>Time:</strong> {beach.travelTime} {beach.travelTime !== 'N/A' && 'mins'}</div>
                  </div>
                  <button 
                    className={`btn ${trip.find((t: any) => t.id === beach.id) ? 'btn-ghost' : 'btn-secondary'}`}
                    style={{ width: '100%', padding: '6px' }}
                    onClick={() => addToTrip(beach)}
                    disabled={trip.find((t: any) => t.id === beach.id)}
                  >
                    {trip.find((t: any) => t.id === beach.id) ? 'Added' : '+ Add to Trip'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Selected Beaches ── */}
      <div className="card card-flush" style={{ marginBottom: 20 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Route size={18} color="var(--teal)" />
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Selected Beaches
            {trip.length > 0 && (
              <span style={{ marginLeft: 10, fontSize: 13, color: 'var(--text-muted)', fontWeight: 400 }}>
                ({trip.length} beach{trip.length !== 1 ? 'es' : ''}, sorted by nearest route)
              </span>
            )}
          </h3>
        </div>

        {trip.length === 0 ? (
          <div style={{ padding: '36px 24px', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, background: 'rgba(20,184,166,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Route size={24} color="var(--teal)" />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              No beaches added yet. Explore the map and click "Add to Trip" to build your itinerary.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16, padding: 16 }}>
            {trip.map((beach, idx) => {
              const distance = userLocation ? calculateDistance(userLocation.lat, userLocation.lon, beach.lat, beach.lon) : 0;
              const { mode, time } = getTravelDetails(distance);
              const suitScore = getParamData(beach, 'Suitability Score');
              const temp = getParamData(beach, 'Temperature');
              
              return (
              <div key={beach.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                padding: '16px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                background: 'var(--card-bg)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{
                      background: 'var(--teal)', color: '#fff',
                      fontSize: 11, fontWeight: 700,
                      padding: '3px 10px', borderRadius: 12
                    }}>Day {idx + 1}</span>
                    <strong style={{ fontSize: 16, color: 'var(--text-primary)' }}>{beach.name}</strong>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>
                    <div><strong>Weather:</strong> {temp}°C</div>
                    <div><strong>Sustainability:</strong> {suitScore}/100</div>
                    <div><strong>Distance:</strong> {distance ? `${Math.round(distance)} km` : '—'}</div>
                    <div><strong>Time:</strong> {distance ? `${time} hrs` : '—'}</div>
                    <div style={{ gridColumn: '1 / -1' }}><strong>Mode:</strong> {distance ? mode : '—'}</div>
                  </div>
                </div>
                <button
                  onClick={() => removeBeach(beach.id)}
                  style={{ background: 'rgba(239,68,68,0.08)', border: 'none', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--danger)', flexShrink: 0, marginLeft: 12 }}
                  title="Remove from trip"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )})}
          </div>
        )}
      </div>

      {/* ── Comparison Table ── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <BarChart2 size={18} color="var(--teal)" />
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Comparison Table</h3>
        </div>

        <div className="card card-flush">
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Beach</th>
                  <th>State</th>
                  <th>Temp</th>
                  <th>Wind</th>
                  <th>Waves</th>
                  <th>UV Index</th>
                  <th>Crowd</th>
                  <th>Suitability</th>
                  <th>Safety</th>
                </tr>
              </thead>
              <tbody>
                {trip.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 24 }}>
                      Add beaches to your trip to see comparison data.
                    </td>
                  </tr>
                ) : trip.map((beach) => {
                  const isRisky = beach.id % 3 === 0;
                  const suit = getParamData(beach, 'Suitability Score');
                  const suitColor = suit >= 70 ? 'var(--safe)' : suit >= 40 ? 'var(--moderate)' : 'var(--danger)';
                  return (
                    <tr key={beach.id}>
                      <td style={{ fontWeight: 600 }}>{beach.name}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{beach.state || beach.location || '—'}</td>
                      <td>{getParamData(beach, 'Temperature')}°C</td>
                      <td>
                        <span className={`badge ${isRisky ? 'badge-danger' : 'badge-safe'}`}>
                          {getParamData(beach, 'Wind Speed')} km/h
                        </span>
                      </td>
                      <td>{getParamData(beach, 'Wave Height')}m</td>
                      <td>{uvBadge(getParamData(beach, 'UV Index'))}</td>
                      <td>{crowdBadge(beach)}</td>
                      <td>
                        <strong style={{ color: suitColor }}>{suit}</strong>
                        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>/100</span>
                      </td>
                      <td>
                        <span className={`badge ${isRisky ? 'badge-danger' : 'badge-safe'}`}>
                          {isRisky ? '⚠ Warning' : '✓ Safe'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Graphical Analysis ── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <BarChart2 size={18} color="var(--teal)" />
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Graphical Analysis</h3>
        </div>

        <div className="card">
          {/* Controls */}
          <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>Parameter 1:</label>
              <select
                value={param1}
                onChange={e => setParam1(e.target.value)}
                className="form-input"
                style={{ width: 'auto', padding: '7px 12px' }}
              >
                {parameters.filter(p => p.key !== 'None').map(p => (
                  <option key={p.key} value={p.key}>{p.label}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>Compare With:</label>
              <select
                value={param2}
                onChange={e => setParam2(e.target.value)}
                className="form-input"
                style={{ width: 'auto', padding: '7px 12px' }}
              >
                {parameters.map(p => (
                  <option key={p.key} value={p.key}>{p.label}</option>
                ))}
              </select>
            </div>
            {/* Legend */}
            <div style={{ display: 'flex', gap: 16, marginLeft: 'auto', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, background: p1cfg.color, borderRadius: 3 }} />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{p1cfg.label}</span>
              </div>
              {param2 !== 'None' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 12, height: 12, background: p2cfg.color, borderRadius: 3 }} />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{p2cfg.label}</span>
                </div>
              )}
            </div>
          </div>

          {/* Bar chart */}
          {trip.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'flex-end', height: 220, gap: 12, paddingTop: 24, borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
              {trip.map(beach => {
                const v1 = getParamData(beach, param1);
                const v2 = param2 !== 'None' ? getParamData(beach, param2) : 0;
                return (
                  <div key={beach.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 56, height: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: '100%', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: p1cfg.color, marginBottom: 4 }}>{v1}</span>
                        <div style={{
                          width: 28,
                          height: `${Math.max((v1 / p1cfg.max) * 180, 4)}px`,
                          background: `linear-gradient(to top, ${p1cfg.color}99, ${p1cfg.color})`,
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.3s ease'
                        }} title={`${p1cfg.label}: ${v1}`} />
                      </div>
                      {param2 !== 'None' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: p2cfg.color, marginBottom: 4 }}>{v2}</span>
                          <div style={{
                            width: 28,
                            height: `${Math.max((v2 / p2cfg.max) * 180, 4)}px`,
                            background: `linear-gradient(to top, ${p2cfg.color}99, ${p2cfg.color})`,
                            borderRadius: '4px 4px 0 0',
                            transition: 'height 0.3s ease'
                          }} title={`${p2cfg.label}: ${v2}`} />
                        </div>
                      )}
                    </div>
                    <span style={{
                      fontSize: 11, color: 'var(--text-muted)', marginTop: 10,
                      maxWidth: 72, textAlign: 'center', overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }} title={beach.name}>
                      {beach.name.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 32, fontSize: 14 }}>
              Add beaches to your trip to see the analysis graph.
            </p>
          )}
        </div>
      </div>

      {/* ── Smart Insights ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(20,184,166,0.08) 0%, rgba(11,60,93,0.06) 100%)',
        border: '1px solid rgba(20,184,166,0.2)',
        borderRadius: 'var(--radius)',
        padding: '20px 24px',
        display: 'flex', gap: 14, alignItems: 'flex-start'
      }}>
        <div style={{ width: 40, height: 40, background: 'rgba(20,184,166,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Lightbulb size={20} color="var(--teal)" />
        </div>
        <div>
          <h4 style={{ color: 'var(--teal)', margin: '0 0 6px 0', fontSize: 14, fontWeight: 700 }}>Smart Insights</h4>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Your itinerary has been automatically sorted using the <strong>Haversine nearest-neighbor algorithm</strong> to minimize travel distance.
            Always review the safety parameters in the table above and check local lifeguard availability before your visit.
          </p>
        </div>
      </div>
    </div>
  );
}
