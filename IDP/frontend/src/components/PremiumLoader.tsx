const PremiumLoader = () => {
  return (
    <div className="loader-container">
      
      {/* subtle wave background */}
      <div className="wave-bg"></div>

      {/* shimmer content */}
      <div className="shimmer-card large"></div>
      <div className="shimmer-card medium"></div>
      <div className="shimmer-card small"></div>

      <p className="loading-text">Loading beach details...</p>
    </div>
  );
};

export default PremiumLoader;
