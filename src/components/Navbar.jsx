import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bell, Search, ChevronDown, User, Settings, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="navbar">
      <div className="nav-search">
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input type="text" placeholder="Search faculty, records, or files..." />
      </div>

      <div className="nav-actions">
        <button className="action-btn">
          <Bell size={20} />
          <span className="badge">3</span>
        </button>

        <div style={{ position: 'relative' }}>
          <div className="user-profile" onClick={() => setShowDropdown(!showDropdown)}>
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.name}&background=3b82f6&color=fff`} 
              alt="Avatar" 
              className="avatar" 
            />
            <div className="user-info">
              <span className="name">{user?.name}</span>
              <span className="role">{user?.role.toUpperCase()}</span>
            </div>
            <ChevronDown size={16} style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }} />
          </div>

          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '120%',
              right: 0,
              width: '200px',
              background: 'white',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border)',
              padding: '0.5rem',
              zIndex: 1001,
              animation: 'fadeIn 0.2s ease-out'
            }}>
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Signed in as</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.email}</span>
              </div>
              <button className="nav-item" style={{ width: '100%', color: 'var(--text-primary)', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <User size={16} /> <span style={{ marginLeft: '0.5rem' }}>My Profile</span>
              </button>
              <button className="nav-item" style={{ width: '100%', color: 'var(--text-primary)', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <Settings size={16} /> <span style={{ marginLeft: '0.5rem' }}>Account Settings</span>
              </button>
              <button 
                onClick={logout}
                className="nav-item" 
                style={{ width: '100%', color: 'var(--danger)', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', marginTop: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}
              >
                <LogOut size={16} /> <span style={{ marginLeft: '0.5rem' }}>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
