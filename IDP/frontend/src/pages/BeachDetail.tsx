import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Cloud, MapPin, Camera, Activity, Building, HeartPulse } from 'lucide-react';
import beachesJson from '../data/beaches.json';
import PremiumLoader from '../components/PremiumLoader';
import { generateAlerts } from './Alerts';

const UNSPLASH_API_KEY = "up8OQ9nV2nmmkUI2Fo96O9r2yMDeG5-6y76q4CA6NUw";
const STORMGLASS_API_KEY = "92c0a3a8-5450-11f1-bdb4-0242ac120004-92c0a45c-5450-11f1-bdb4-0242ac120004";

export default function BeachDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const initialBeach = location.state || beachesJson.find((b: any) => b.id === Number(id));
  
  const [loading, setLoading] = useState(true);
  const [beach] = useState<any>(initialBeach);
  
  const [images, setImages] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [weather, setWeather] = useState<any>(null);

  // Phase 4 Smart Assistant State
  const [smartAlerts, setSmartAlerts] = useState<any[]>([]);
  const [sustainabilityScore, setSustainabilityScore] = useState<number | null>(null);
  const [crowdPrediction, setCrowdPrediction] = useState<string>('');


  const getBestTime = (weatherObj: any) => {
    if (!weatherObj) return "Not available";

    const temp = weatherObj.temperature !== "--" ? Number(weatherObj.temperature) : 0;
    const wind = Number(weatherObj.windSpeed) || 0;
    const wave = Number(weatherObj.waveHeight) || 0;

    if (temp > 34) return "Early Morning (6–9 AM) or Evening (5–7 PM)";
    if (wave > 2 || wind > 12) return "Avoid midday, visit morning or evening";
    if (temp >= 25 && temp <= 32 && wave < 1.5) return "Evening (4–7 PM) 🌅";

    return "Morning or Evening";
  };

  const getBestMonths = (state: string) => {
    const map: any = {
      Goa: "Nov – Feb",
      Karnataka: "Oct – Mar",
      Kerala: "Sep – Mar",
      Maharashtra: "Nov – Feb",
      "Tamil Nadu": "Dec – Mar",
      TamilNadu: "Dec – Mar"
    };
    return map[state] || "Oct – Mar";
  };

  useEffect(() => {
    if (!beach) return;

    const lat = Number(beach.lat || beach.latitude);
    const lng = Number(beach.lon || beach.lng || beach.longitude);


    const fetchImages = async () => {
      const queries = [
        `${beach.name} beach`,
        `${beach.state} beach`,
        "india beach"
      ];

      for (let q of queries) {
        try {
          const res = await fetch(
            `https://api.unsplash.com/search/photos?query=${q}&client_id=${UNSPLASH_API_KEY}&per_page=5`
          );
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            return data;
          }
        } catch (e) {
          console.error("Image fetch error:", e);
        }
      }
      return { results: [] };
    };

    const fetchMarineData = async () => {
      const params = 'waveHeight,waterTemperature,windSpeed,currentDirection';
      const res = await fetch(`https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}`, {
        headers: { Authorization: STORMGLASS_API_KEY }
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data;
    };

    const fetchOverpass = async (query: string) => {
      try {
        const res = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          body: query
        });
        if (!res.ok) return [];
        const data = await res.json();
        if (!data.elements) return [];
        return data.elements.map((item: any) => ({
          name: item.tags?.name || "Unknown"
        })).filter((item: any) => item.name !== "Unknown").slice(0, 5);
      } catch (err) {
        console.error("Overpass API error:", err);
        return [];
      }
    };

    const fetchHotels = async () => {
      let hotelQuery = `
[out:json];
(
  node(around:50000, ${lat}, ${lng})["tourism"="hotel"];
  way(around:50000, ${lat}, ${lng})["tourism"="hotel"];
);
out center;`;
      let res = await fetchOverpass(hotelQuery);
      if (res.length === 0) {
         hotelQuery = `
[out:json];
(
  node(around:100000, ${lat}, ${lng})["tourism"="hotel"];
  way(around:100000, ${lat}, ${lng})["tourism"="hotel"];
);
out center;`;
         res = await fetchOverpass(hotelQuery);
      }
      return res;
    };

    const fetchHospitals = async () => {
      let hospitalQuery = `
[out:json];
(
  node(around:50000, ${lat}, ${lng})["amenity"="hospital"];
  way(around:50000, ${lat}, ${lng})["amenity"="hospital"];
);
out center;`;
      let res = await fetchOverpass(hospitalQuery);
      if (res.length === 0) {
         hospitalQuery = `
[out:json];
(
  node(around:100000, ${lat}, ${lng})["amenity"="hospital"];
  way(around:100000, ${lat}, ${lng})["amenity"="hospital"];
);
out center;`;
         res = await fetchOverpass(hospitalQuery);
      }
      return res;
    };

    const fetchWeather = async () => {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=40c00170642d361d99156dacec66cf9c&units=metric`
      );
      return res.json();
    };

    const loadData = async () => {
      try {
        const [
          imgs,
          marineRaw,
          htls,
          hsps,
          wRes
        ] = await Promise.all([
          fetchImages(),
          fetchMarineData(),
          fetchHotels(),
          fetchHospitals(),
          fetchWeather().catch(() => null)
        ]);

        const activitiesByState: any = {
          Goa: ["Water sports like parasailing", "Beach nightlife and parties", "Scuba diving", "Sunset viewing"],
          Karnataka: ["Boating", "Fishing", "Temple visits", "Sunset photography"],
          Kerala: ["Backwater rides", "Houseboat experience", "Ayurveda relaxation", "Photography"],
          Maharashtra: ["Jet skiing", "Fort exploration", "Local seafood tasting", "Beach walks"],
          "Tamil Nadu": ["Surfing", "Temple visits", "Boat rides", "Sunrise viewing"]
        };
        const staticActivities = activitiesByState[beach.state] || ["Relaxing", "Photography", "Walking"];

        setImages(imgs.results || []);
        setActivities(staticActivities.map((name: string) => ({ name })));
        setHotels(htls || []);
        setHospitals(hsps || []);

        const baseWeather: any = {};
        
        if (wRes && wRes.main) {
          const temp = wRes.main.temp;
          const feels = wRes.main.feels_like;
          
          baseWeather.temperature = temp !== undefined ? Math.round(temp) : "--";
          baseWeather.feelsLike = feels !== undefined ? Math.round(feels) : undefined;
          baseWeather.humidity = wRes.main.humidity;
          baseWeather.pressure = wRes.main.pressure;
          baseWeather.visibility = wRes.visibility;
          baseWeather.windSpeed = wRes.wind?.speed ? Math.round(wRes.wind.speed * 3.6) : undefined;
          if (wRes.weather && wRes.weather[0]) {
             baseWeather.condition = wRes.weather[0].description;
          }
        }

        if (marineRaw && marineRaw.hours && marineRaw.hours.length > 0) {
           const marine = marineRaw.hours[0];
           baseWeather.waveHeight = marine.waveHeight?.noaa || 0;
           baseWeather.waterTemp = marine.waterTemperature?.noaa || 0;
           baseWeather.currentDirection = marine.currentDirection?.noaa || 0;
           if (!baseWeather.windSpeed && marine.windSpeed?.noaa) {
             baseWeather.windSpeed = marine.windSpeed?.noaa;
           }
        }
        setWeather(baseWeather);

      } catch (err) {
        console.error("Error loading beach details:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    if (!beach || !weather) return;

    // 1. SMART ALERTS SYSTEM
    const calculateAlerts = () => {
      const beachAlerts = generateAlerts(beach).map((a: any) => ({
        beachName: beach.name,
        alertType: a.type,
        severity: a.severity,
        message: a.message
      }));
      setSmartAlerts(beachAlerts);
      return beachAlerts;
    };

    // 6. CROWD PREDICTION
    const determineCrowd = () => {
      const day = new Date().getDay();
      const crowdLvl = (day === 0 || day === 6) ? "high" : "moderate";
      setCrowdPrediction(crowdLvl);
      return crowdLvl;
    };

    // 2. SUSTAINABILITY SCORE
    const calculateSustainability = (alertsList: any[], crowdLevel: string) => {
      const wave = Number(weather.waveHeight) || 0;
      const temp = Number(weather.temperature) || 0;

      let score = 60; // strong base

      // Wave (good if calm)
      if (wave < 1) score += 15;
      else if (wave < 2) score += 10;
      else score += 5;

      // Weather
      if (temp >= 25 && temp <= 32) score += 10;
      else score += 5;

      // Crowd
      if (crowdLevel === "low") score += 10;
      else if (crowdLevel === "moderate") score += 5;

      // Hotels (less = better)
      if (hotels?.length < 5) score += 10;
      else if (hotels?.length < 15) score += 5;

      // Alerts
      if (!alertsList || alertsList.length === 0) score += 10;
      else score += 5;

      const finalScore = Math.min(95, Math.round(score));
      setSustainabilityScore(finalScore);
      return finalScore;
    };

    // 7. BEST TIME TO VISIT
    const calculateBestTime = () => {
      const bestTime = getBestTime(weather);
      beach.bestTime = bestTime;
    };

    // 3. BEACH RANKING SYSTEM
    const rankBeaches = (score: number) => {
      const dummyRanked = beachesJson.map((b: any) => ({
        ...b,
        overallScore: b.id === beach.id ? score : 50 + (b.id % 40)
      })).sort((a: any, b: any) => b.overallScore - a.overallScore);
      
      if (dummyRanked.length > 0) dummyRanked[0].isBestChoice = true;

      return dummyRanked;
    };

    const generatedAlerts = calculateAlerts();
    const crowdLvl = determineCrowd();
    calculateBestTime();
    const score = calculateSustainability(generatedAlerts, crowdLvl);
    rankBeaches(score);


  }, [weather, beach, hotels]);

  if (!beach || loading) {
    return <PremiumLoader />;
  }

  return (
    <div className="page-wrapper" style={{ padding: 20 }}>
      {/* Header */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-ghost"
        style={{ marginBottom: 24, display: 'inline-flex' }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div style={{ marginBottom: 30 }}>
        <h1 className="header-title" style={{ marginBottom: 8 }}>{beach.name}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 14, marginBottom: 12 }}>
          <MapPin size={16} color="var(--teal)" />
          {beach.state || beach.location}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {sustainabilityScore !== null && sustainabilityScore > 80 && <span className="badge" style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--safe)', border: '1px solid rgba(34,197,94,0.2)' }}>🌿 Eco Friendly</span>}
          {crowdPrediction === 'low' && <span className="badge" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--info)', border: '1px solid rgba(59,130,246,0.2)' }}>🧘 Peaceful</span>}
          {Number(weather?.waveHeight) >= 1.5 && <span className="badge" style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316', border: '1px solid rgba(249,115,22,0.2)' }}>🏄 Adventure Spot</span>}
          {smartAlerts.length === 0 && <span className="badge" style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--safe)', border: '1px solid rgba(34,197,94,0.2)' }}>🛡 Safe</span>}
        </div>
      </div>

      {/* Images Gallery */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, marginBottom: 16 }}>
          <Camera size={20} color="var(--teal)" /> Image Gallery
        </h3>
        {images.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {images.map((img: any) => (
              <img 
                key={img.id} 
                src={img.urls?.regular || img.urls?.small} 
                alt={img.alt_description || beach.name} 
                style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 'var(--radius)' }}
              />
            ))}
          </div>
        ) : (
          <div style={{ padding: 40, textAlign: 'center', background: 'var(--card-bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>Showing default beach images</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80", "https://images.unsplash.com/photo-1509233725247-49e657c54213?w=600&q=80"].map((src, idx) => (
                <img 
                  key={idx} 
                  src={src} 
                  alt="Default Beach" 
                  style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 'var(--radius)' }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        
        {/* Weather & Report */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, marginBottom: 16 }}>
              <Cloud size={18} color="var(--teal)" /> Live Weather
            </h3>
            {weather ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <div style={{ fontSize: 42, fontWeight: 800 }}>
                  {weather.temperature !== "--" ? `${weather.temperature}°C` : "--"}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, textTransform: 'capitalize' }}>{weather.condition}</div>
                  {weather.feelsLike !== undefined && <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Feels Like: {weather.feelsLike}°C</div>}
                  {weather.humidity !== undefined && <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Humidity: {weather.humidity}%</div>}
                  <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Wind: {weather.windSpeed} km/h</div>
                  {weather.waveHeight !== undefined && (
                    <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Waves: {weather.waveHeight} m</div>
                  )}
                  {weather.waterTemp !== undefined && (
                    <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Water Temp: {weather.waterTemp}°C</div>
                  )}
                  {weather.currentDirection !== undefined && (
                    <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Current Dir: {weather.currentDirection}°</div>
                  )}
                  {weather.pressure !== undefined && (
                    <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Pressure: {weather.pressure} hPa</div>
                  )}
                  {weather.visibility !== undefined && (
                    <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Visibility: {weather.visibility / 1000} km</div>
                  )}
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                    {beach.distance && <p style={{ margin: '0 0 4px 0', fontSize: 14, fontWeight: 600 }}>Distance: {beach.distance} km</p>}
                    {beach.time && <p style={{ margin: '0 0 4px 0', fontSize: 14, fontWeight: 600 }}>Travel Time: {beach.time}</p>}
                    <p style={{ margin: '0 0 4px 0', fontSize: 14, fontWeight: 600 }}>Crowd: {beach.crowd || crowdPrediction}</p>
                    <p style={{ margin: '0 0 4px 0', fontSize: 14, fontWeight: 600 }}>Sustainability: {beach.sustainabilityScore || sustainabilityScore}</p>
                    <p style={{ margin: '0 0 4px 0', fontSize: 14, fontWeight: 600 }}>Alerts: {smartAlerts.length > 0 ? smartAlerts.map((a: any) => a.message).join(', ') : 'None'}</p>
                    <p style={{ margin: '0 0 4px 0', fontSize: 14, fontWeight: 600 }}>Best Time: {getBestTime(weather)}</p>
                    <p style={{ margin: '0 0 4px 0', fontSize: 14, fontWeight: 600 }}>Best Months: {getBestMonths(beach.state)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>Weather data unavailable.</p>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontSize: 16, marginBottom: 12 }}>Beach Report</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {beach.name} is a beautiful coastal destination in {beach.state || beach.location}. 
              Known for its scenic views and relaxing atmosphere, it serves as a great getaway.
              Whether you are looking to enjoy water activities, soak in the sun, or just take a peaceful stroll along the shore, this beach offers a unique local experience.
            </p>
          </div>

        </div>

        {/* Dynamic Activities, Hotels, Hospitals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Things to Do */}
          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, marginBottom: 16 }}>
              <Activity size={18} color="var(--teal)" /> Things to Do
            </h3>
            {activities.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {activities.map((act: any, idx: number) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)' }} />
                    {act.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>Nearby facilities available in closest town</p>
            )}
          </div>

          {/* Hotels */}
          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, marginBottom: 16 }}>
              <Building size={18} color="var(--teal)" /> Nearby Hotels
            </h3>
            {hotels.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {hotels.map((hotel: any, idx: number) => (
                  <li key={idx} style={{ fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 500 }}>{hotel.name}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                      {hotel.distance ? `${(hotel.distance / 1000).toFixed(1)} km` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            ) : hotels.length === 0 && hospitals.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>Nearby facilities available in closest town</p>
            ) : null}
          </div>

          {/* Hospitals */}
          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, marginBottom: 16 }}>
              <HeartPulse size={18} color="#EF4444" /> Nearby Hospitals
            </h3>
            {hospitals.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {hospitals.map((hosp: any, idx: number) => (
                  <li key={idx} style={{ fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 500 }}>{hosp.name}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                      {hosp.distance ? `${(hosp.distance / 1000).toFixed(1)} km` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            ) : hotels.length === 0 && hospitals.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>Nearby facilities available in closest town</p>
            ) : null}
          </div>

        </div>
      </div>
    </div>
  );
}
