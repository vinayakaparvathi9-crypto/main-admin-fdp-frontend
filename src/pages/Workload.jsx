import React, { useState, useEffect, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { 
  Clock, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  Search,
  Filter,
  MoreVertical,
  X,
  FileText
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Workload = () => {
  const { user } = useContext(AuthContext);
  const [workloads, setWorkloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    teachingHours: '',
    nonTeachingDuties: '',
    weekNumber: '',
    month: 'May'
  });

  const fetchWorkloads = async () => {
    try {
      const { data } = await API.get('/workload');
      setWorkloads(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching workload:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkloads();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/workload', formData);
      setShowModal(false);
      setFormData({ teachingHours: '', nonTeachingDuties: '', weekNumber: '', month: 'May' });
      fetchWorkloads();
    } catch (error) {
      console.error('Error submitting workload:', error);
      alert('Error submitting workload');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.patch(`/workload/${id}`, { status });
      fetchWorkloads();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Teaching Hours',
      data: [16, 18, 14, 20],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Workload & Time Tracking</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Monitor teaching hours and administrative duties.</p>
        </div>
        {user.role === 'faculty' && (
          <button 
            onClick={() => setShowModal(true)}
            className="action-btn" 
            style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', width: 'auto', borderRadius: '10px' }}
          >
            <Plus size={20} style={{ marginRight: '0.5rem' }} /> Submit Workload
          </button>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-details">
            <h3>Total Hours</h3>
            <div className="number">68h</div>
            <div className="stat-trend trend-up">This Month</div>
          </div>
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
            <Clock size={24} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-details">
            <h3>Pending Approvals</h3>
            <div className="number">{workloads.filter(w => w.status === 'pending').length}</div>
            <div className="stat-trend" style={{ color: 'var(--warning)' }}>Requires Action</div>
          </div>
          <div className="stat-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>
            <AlertCircle size={24} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-details">
            <h3>Approved Entries</h3>
            <div className="number">{workloads.filter(w => w.status === 'approved').length}</div>
            <div className="stat-trend trend-up">All Verified</div>
          </div>
          <div className="stat-icon" style={{ background: '#f0fdf4', color: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="card-title" style={{ marginBottom: '1.5rem' }}>Weekly Teaching Hours Trend</h3>
          <div style={{ height: '300px' }}>
            <Line data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="chart-card">
          <h3 className="card-title" style={{ marginBottom: '1.5rem' }}>Duty Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['Lab In-charge', 'Student Mentoring', 'Research Guidance'].map((duty, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '10px', background: '#f8fafc' }}>
                <div style={{ background: 'white', padding: '8px', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                  <FileText size={18} color="#3b82f6" />
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{duty}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="table-card" style={{ marginTop: '2.5rem' }}>
        <div className="card-header">
          <h3 className="card-title">Detailed Workload Logs</h3>
          <div className="nav-search" style={{ width: '250px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search logs..." style={{ fontSize: '0.75rem', paddingLeft: '2.25rem' }} />
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Faculty</th>
              <th>Week / Month</th>
              <th>Teaching Hours</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading workload data...</td></tr>
            ) : workloads.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No workload entries found.</td></tr>
            ) : workloads.map((w, i) => (
              <tr key={i}>
                <td>
                  <div style={{ fontWeight: 600 }}>{w.faculty?.user?.name || 'Unknown'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{w.faculty?.department}</div>
                </td>
                <td>Week {w.weekNumber}, {w.month}</td>
                <td>{w.teachingHours}h</td>
                <td>
                  <span className={`status-badge status-${w.status}`}>
                    {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {(user.role === 'admin' || user.role === 'hod') && w.status === 'pending' ? (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button onClick={() => handleStatusUpdate(w._id, 'approved')} className="action-btn" style={{ color: 'var(--success)', border: '1px solid #dcfce7' }}>Approve</button>
                      <button onClick={() => handleStatusUpdate(w._id, 'rejected')} className="action-btn" style={{ color: 'var(--danger)', border: '1px solid #fee2e2' }}>Reject</button>
                    </div>
                  ) : (
                    <button className="action-btn"><MoreVertical size={16} /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Submit Workload Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="fade-in" style={{
            background: 'white',
            width: '100%',
            maxWidth: '500px',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Submit Weekly Workload</h2>
              <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Month</label>
                  <select 
                    value={formData.month}
                    onChange={(e) => setFormData({...formData, month: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: '10px' }}
                  >
                    <option value="May">May</option>
                    <option value="June">June</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Week Number</label>
                  <input 
                    type="number" 
                    value={formData.weekNumber}
                    onChange={(e) => setFormData({...formData, weekNumber: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: '10px' }} 
                    placeholder="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Teaching Hours</label>
                <div style={{ position: 'relative' }}>
                  <Clock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                  <input 
                    type="number" 
                    value={formData.teachingHours}
                    onChange={(e) => setFormData({...formData, teachingHours: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid var(--border)', borderRadius: '10px' }} 
                    placeholder="16"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Non-Teaching Duties</label>
                <textarea 
                  value={formData.nonTeachingDuties}
                  onChange={(e) => setFormData({...formData, nonTeachingDuties: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: '10px', minHeight: '80px' }} 
                  placeholder="e.g. Lab Maintenance, Mentoring..."
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '10px', background: 'white', fontWeight: 600, cursor: 'pointer' }}
                >Cancel</button>
                <button 
                  type="submit"
                  style={{ flex: 2, padding: '0.75rem', border: 'none', borderRadius: '10px', background: 'var(--accent)', color: 'white', fontWeight: 600, cursor: 'pointer' }}
                >Submit Log</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workload;
