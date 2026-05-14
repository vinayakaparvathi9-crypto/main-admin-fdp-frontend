import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  Star, 
  Building2, 
  FileText, 
  LogOut, 
  GraduationCap,
  Calendar,
  Settings,
  Bell
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  const navigation = [
    {
      label: 'Main Menu',
      items: [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Faculty Management', path: '/faculty', icon: <Users size={20} /> },
        { name: 'Department Analytics', path: '/departments', icon: <Building2 size={20} /> },
      ]
    },
    {
      label: 'Academic & Tracking',
      items: [
        { name: 'Workload & Time', path: '/workload', icon: <Clock size={20} /> },
        { name: 'Attendance Tracking', path: '/attendance', icon: <Calendar size={20} /> },
        { name: 'Performance Appraisal', path: '/appraisal', icon: <Star size={20} /> },
        { name: 'Reports & Logs', path: '/reports', icon: <FileText size={20} /> },
      ]
    },
    {
      label: 'Configuration',
      items: [
        { name: 'General Settings', path: '/settings', icon: <Settings size={20} /> },
      ]
    }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <GraduationCap color="white" size={24} />
        </div>
        <span className="brand-name">EduSmart ERP</span>
      </div>

      <div className="nav-container">
        {navigation.map((group, idx) => (
          <div key={idx} className="nav-group">
            <div className="nav-label">{group.label}</div>
            {group.items.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path} 
                className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <button 
          onClick={logout} 
          className="nav-item" 
          style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', color: '#ef4444' }}
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
