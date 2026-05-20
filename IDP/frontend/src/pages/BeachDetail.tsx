import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Cloud, MapPin, Camera, Activity, Building, HeartPulse, Star } from 'lucide-react';
import apiClient from '../api/client';
import beachesJson from '../data/beaches.json';

const UNSPLASH_API_KEY = "up8OQ9nV2nmmkUI2Fo96O9r2yMDeG5-6y76q4CA6NUw";
const FOURSQUARE_API_KEY = "XKOT2SPT5DFO2I3CHSIRXEY5NMO1TKQA5YFGDOD30PEYK0DQ";

export default function BeachDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const stateBeach = location.state;
  
  const [loading, setLoading] = useState(true);
  const [beach, setBeach] = useState<any>(stateBeach || null);
  
  const [images, setImages] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    let b = beach;
    if (!b) {
      b = beachesJson.find((b: any) => b.id === Number(id));
      if (!b) return;
      setBeach(b);
    }

    const fetchImages = async () => {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${b.name} ${b.state} beach India&client_id=${UNSPLASH_API_KEY}&orientation=landscape&per_page=5`
      );
      return res.json();
    };

    const fetchActivities = async () => {
      const queries = ["tourist attraction", "water sports", "beach activities"];
      const results = await Promise.all(
        queries.map(q =>
          fetch(
            `https://api.foursquare.com/v3/places/search?query=${q}&ll=${b.lat},${b.lon}`,
            { headers: { Authorization: FOURSQUARE_API_KEY } }
          ).then(res => res.json())
        )
      );
      return results.flatMap(r => r.results).slice(0, 7);
    };

    const fetchHotels = async () => {
      const res = await fetch(
        `https://api.foursquare.com/v3/places/search?query=hotel&ll=${b.lat},${b.lon}`,
        { headers: { Authorization: FOURSQUARE_API_KEY } }
      );
      return res.json();
    };

    const fetchHospitals = async () => {
      const res = await fetch(
        `https://api.foursquare.com/v3/places/search?query=hospital&ll=${b.lat},${b.lon}`,
        { headers: { Authorization: FOURSQUARE_API_KEY } }
      );
      return res.json();
    };

    const fetchReviews = async () => {
      const res = await fetch(
        `https://api.foursquare.com/v3/places/search?query=${b.name}&ll=${b.lat},${b.lon}`,
        { headers: { Authorization: FOURSQUARE_API_KEY } }
      );
      return res.json();
    };

    const loadData = async () => {
      setLoading(true);
      try {
        const [
          imgs,
          acts,
          htls,
          hsps,
          revs,
          wRes
        ] = await Promise.all([
          fetchImages(),
          fetchActivities(),
          fetchHotels(),
          fetchHospitals(),
          fetchReviews(),
          apiClient.get(`/weather?lat=${b.lat}&lon=${b.lon}`).catch(() => ({ data: null }))
        ]);

        setImages(imgs.results || []);
        setActivities(acts || []);
        setHotels(htls.results?.slice(0, 5) || []);
        setHospitals(hsps.results?.slice(0, 3) || []);
        setReviews(revs.results?.slice(0, 3) || []);
        setWeather(wRes.data);
      } catch (err) {
        console.error("Error loading beach details:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (!beach || loading) {
    return (
      <div className="loading" style={{ paddingTop: 80, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="loading-spinner" style={{ marginBottom: 16 }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading live data for this beach...</p>
      </div>
    );
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 14 }}>
          <MapPin size={16} color="var(--teal)" />
          {beach.state || beach.location}
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
                src={img.urls.regular} 
                alt={img.alt_description || beach.name} 
                style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 'var(--radius)' }}
              />
            ))}
          </div>
        ) : (
          <div style={{ padding: 40, textAlign: 'center', background: 'var(--card-bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-muted)' }}>No images available for this location.</p>
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
                <div style={{ fontSize: 42, fontWeight: 800 }}>{Math.round(weather.temperature)}°C</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, textTransform: 'capitalize' }}>{weather.condition}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Wind: {weather.windSpeed} km/h</div>
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

          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, marginBottom: 16 }}>
              <Star size={18} color="#F59E0B" /> Top Reviews
            </h3>
            {reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {reviews.map((r: any, idx: number) => (
                  <div key={idx} style={{ paddingBottom: 12, borderBottom: idx < reviews.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{r.name}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                      {r.location?.formatted_address || r.location?.locality || 'Local Guide'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No reviews available.</p>
            )}
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
              <p style={{ color: 'var(--text-muted)' }}>Popular for scenic views and local experiences.</p>
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
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No hotels found nearby.</p>
            )}
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
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No hospitals found nearby.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
