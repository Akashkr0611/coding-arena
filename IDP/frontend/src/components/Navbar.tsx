import { NavLink } from 'react-router-dom';
import { Map, Star, AlertTriangle, User, Route as RouteIcon, LayoutDashboard, Waves, Sliders } from 'lucide-react';

const navLinks = [
  { to: '/dashboard',      icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/',               icon: <Map size={18} />,             label: 'Explore Map' },
  { to: '/recommendations',icon: <Star size={18} />,            label: 'For You' },
  { to: '/trip-planner',   icon: <RouteIcon size={18} />,       label: 'Trip Planner' },
  { to: '/alerts',         icon: <AlertTriangle size={18} />,   label: 'Alerts' },
  { to: '/preferences',    icon: <Sliders size={18} />,         label: 'Preferences' },
];

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>
          <Waves size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle', color: 'var(--teal)' }} />
          Coast<span>Wise</span>
        </h1>
        <div className="sidebar-subtitle">India Beach Intelligence</div>
      </div>

      <nav className="sidebar-nav">
        {navLinks.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        © 2025 CoastWise · v2.0
      </div>
    </div>
  );
}
