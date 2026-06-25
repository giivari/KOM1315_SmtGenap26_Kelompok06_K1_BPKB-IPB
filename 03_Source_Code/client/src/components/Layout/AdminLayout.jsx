import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Newspaper, Camera, Settings, ShieldCheck, Globe, LogOut } from 'lucide-react';
import './AdminLayout.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} />, exact: true },
    { path: '/admin/articles', label: 'Articles', icon: <Newspaper size={20} /> },
    { path: '/admin/documentation', label: 'Documentation', icon: <Camera size={20} /> },
    { path: '/admin/operations', label: 'Operations', icon: <Settings size={20} /> },
    { path: '/admin/security', label: 'Security Dashboard', icon: <ShieldCheck size={20} /> },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <img src="/assets/2-removebg-preview.png" alt="BPKB" />
          </Link>
          <span className="sidebar-title">Admin Panel</span>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${
                item.exact
                  ? location.pathname === item.path ? 'active' : ''
                  : isActive(item.path) && !( item.path === '/admin' && location.pathname !== '/admin') ? 'active' : ''
              }`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.name}</span>
              <span className="sidebar-user-role">{user?.role}</span>
            </div>
          </div>
          <div className="sidebar-actions">
            <Link to="/" className="sidebar-action-btn"><Globe size={18} className="inline-icon" /> Site</Link>
            <button onClick={logout} className="sidebar-action-btn logout"><LogOut size={18} className="inline-icon" /> Logout</button>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
