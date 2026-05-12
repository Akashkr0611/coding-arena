import { NavLink } from 'react-router-dom';
import { Map, Star, AlertTriangle, User, Route as RouteIcon, LayoutDashboard } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>CoastWise</h1>
      </div>
      <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={20} />
        <span>Dashboard</span>
      </NavLink>
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Map size={20} />
        <span>Explore Map</span>
      </NavLink>
      <NavLink to="/recommendations" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Star size={20} />
        <span>For You</span>
      </NavLink>
      <NavLink to="/trip-planner" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <RouteIcon size={20} />
        <span>Trip Planner</span>
      </NavLink>
      <NavLink to="/alerts" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <AlertTriangle size={20} />
        <span>Alerts</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <User size={20} />
        <span>Preferences</span>
      </NavLink>
    </div>
  );
}
