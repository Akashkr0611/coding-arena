import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Recommendations from './pages/Recommendations';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';
import BeachDetail from './pages/BeachDetail';
import TripPlanner from './pages/TripPlanner';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/beach/:id" element={<BeachDetail />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/trip-planner" element={<TripPlanner />} />
          </Routes>
        </div>
        <Chatbot />
      </div>
    </BrowserRouter>
  );
}

export default App;
