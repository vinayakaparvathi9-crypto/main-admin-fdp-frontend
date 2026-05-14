import React, { useState, useEffect, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { 
  UserCheck, 
  UserX, 
  Clock, 
  Calendar as CalendarIcon,
  Search,
  CheckCircle2,
  XCircle,
  Clock3,
  MapPin,
  Fingerprint
} from 'lucide-react';

const Attendance = () => {
  const { user } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  const fetchLogs = async () => {
    try {
      const { data } = await API.get('/attendance');
      setLogs(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleMarkAttendance = async (status) => {
    setMarking(true);
    try {
      const checkTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      await API.post('/attendance', { 
        status, 
        checkIn: checkTime,
        remarks: `Checked in via Web Portal at ${checkTime}`
      });
      fetchLogs();
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Error marking attendance');
    }
    setMarking(false);
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Attendance Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Track daily presence and check-in/out logs.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ background: 'white', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarIcon size={18} color="var(--accent)" />
            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Check-in Card */}
        <div className="chart-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Fingerprint size={40} color="var(--accent)" />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Daily Check-in</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Please mark your presence for today.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button 
              disabled={marking}
              onClick={() => handleMarkAttendance('present')}
              style={{ width: '100%', padding: '1rem', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <CheckCircle2 size={20} /> Mark Present
            </button>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                disabled={marking}
                onClick={() => handleMarkAttendance('leave')}
                style={{ flex: 1, padding: '0.75rem', background: 'white', border: '1px solid var(--border)', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}
              >Apply Leave</button>
              <button 
                disabled={marking}
                style={{ flex: 1, padding: '0.75rem', background: 'white', border: '1px solid var(--border)', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}
              >On Duty</button>
            </div>
          </div>
          
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Shift Start</div>
              <div style={{ fontWeight: 700 }}>09:00 AM</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Shift End</div>
              <div style={{ fontWeight: 700 }}>04:30 PM</div>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="table-card">
          <div className="card-header">
            <h3 className="card-title">Recent Attendance Logs</h3>
            <div className="nav-search" style={{ width: '200px' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" placeholder="Search date..." style={{ fontSize: '0.75rem', paddingLeft: '2.25rem' }} />
            </div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Faculty</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading logs...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No attendance logs found.</td></tr>
              ) : logs.map((log, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{log.faculty?.user?.name || 'Faculty'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{log.faculty?.department}</div>
                  </td>
                  <td>{new Date(log.date).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock3 size={14} color="var(--text-muted)" />
                      {log.checkIn || '--:--'}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge status-${log.status}`}>
                      {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn"><MapPin size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-details">
            <h3>Working Days</h3>
            <div className="number">22</div>
            <div className="stat-trend trend-up">Current Month</div>
          </div>
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}><UserCheck size={24} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-details">
            <h3>Total Leaves</h3>
            <div className="number">1.5</div>
            <div className="stat-trend trend-down">Remaining: 10.5</div>
          </div>
          <div className="stat-icon" style={{ background: '#fef2f2', color: '#ef4444' }}><UserX size={24} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-details">
            <h3>Late Arrivals</h3>
            <div className="number">0</div>
            <div className="stat-trend trend-up">Punctual</div>
          </div>
          <div className="stat-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}><Clock size={24} /></div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
