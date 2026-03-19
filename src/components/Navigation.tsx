import { Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, ClipboardList, Grid3x3 } from 'lucide-react';

export function Navigation() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="nav-bar">
      <div className="nav-inner">
        <Link to="/dashboard" className="nav-brand">
          <div className="nav-brand-icon">
            <Shield className="w-5 h-5" />
          </div>
          <span className="nav-brand-text">CyberRisk<span className="nav-brand-accent">Analyzer</span></span>
        </Link>

        <div className="nav-links">
          <Link
            to="/dashboard"
            className={`nav-link ${isActive('/dashboard') ? 'nav-link--active' : ''}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/assessment"
            className={`nav-link ${isActive('/assessment') ? 'nav-link--active' : ''}`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Nova Avaliação</span>
          </Link>

          <Link
            to="/correlation"
            className={`nav-link ${isActive('/correlation') ? 'nav-link--active' : ''}`}
          >
            <Grid3x3 className="w-4 h-4" />
            <span>Matriz</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
