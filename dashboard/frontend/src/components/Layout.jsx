import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Folder,
  Cpu,
  Activity,
  Settings,
  Menu,
  X,
  Github
} from 'lucide-react';
import { useWebSocket } from '../context/WebSocketContext';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { connected } = useWebSocket();

  const navigation = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: Folder },
    { name: 'Agents', path: '/agents', icon: Cpu },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <Activity size={32} className="logo-icon" />
            {sidebarOpen && <span className="logo-text">SAAT</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
            <div className="status-dot" />
            {sidebarOpen && (
              <span>{connected ? 'Connected' : 'Disconnected'}</span>
            )}
          </div>
          <a
            href="https://github.com/DavidROliverBA/SAAT-ClaudeCode"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            <Github size={20} />
            {sidebarOpen && <span>View on GitHub</span>}
          </a>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-wrapper">
        {/* Header */}
        <header className="header">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="header-right">
            <span className="version-badge">v1.0.0</span>
          </div>
        </header>

        {/* Page content */}
        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
