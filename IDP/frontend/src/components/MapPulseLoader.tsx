const MapPulseLoader = () => {
  return (
    <div className="map-loader">
      <div className="pulse-marker" style={{ top: "40%", left: "45%" }}></div>
      <div className="pulse-marker" style={{ top: "50%", left: "55%" }}></div>
      <div className="pulse-marker" style={{ top: "60%", left: "50%" }}></div>

      <p className="loading-text">Loading map data...</p>
    </div>
  );
};

export default MapPulseLoader;
