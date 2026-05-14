import React, { useState, useEffect, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { 
  Award, 
  Target, 
  BarChart3, 
  Star, 
  ClipboardCheck,
  MoreVertical,
  Plus,
  X,
  Zap,
  BookOpen,
  Users
} from 'lucide-react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const PerformanceAppraisal = () => {
  const { user } = useContext(AuthContext);
  const [appraisals, setAppraisals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    academicYear: '2025-26',
    apiScore: '',
    researchScore: '',
    studentFeedback: '',
    comments: ''
  });

  const fetchAppraisals = async () => {
    try {
      const { data } = await API.get('/appraisal');
      setAppraisals(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appraisals:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppraisals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/appraisal', formData);
      setShowModal(false);
      fetchAppraisals();
    } catch (error) {
      console.error('Error submitting appraisal:', error);
      alert('Error submitting appraisal');
    }
  };

  const radarData = {
    labels: ['API Score', 'Research', 'Teaching', 'Feedback', 'Admin'],
    datasets: [{
      label: 'Performance Metrics',
      data: [85, 70, 95, 90, 80],
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: '#3b82f6',
      pointBackgroundColor: '#3b82f6',
      pointBorderColor: '#fff',
    }]
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Performance Appraisal</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Track API scores and research performance metrics.</p>
        </div>
        {user.role === 'faculty' && (
          <button 
            onClick={() => setShowModal(true)}
            className="action-btn" 
            style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', width: 'auto', borderRadius: '10px' }}
          >
            <Plus size={20} style={{ marginRight: '0.5rem' }} /> Self-Assessment
          </button>
        )}
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-details">
            <h3>Avg API Score</h3>
            <div className="number">842</div>
            <div className="stat-trend trend-up"><Zap size={14} /> Top 10%</div>
          </div>
          <div className="stat-icon" style={{ background: '#f0fdf4', color: '#10b981' }}><Award size={24} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-details">
            <h3>Research Papers</h3>
            <div className="number">12</div>
            <div className="stat-trend trend-up"><BookOpen size={14} /> +2 this year</div>
          </div>
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}><Target size={24} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-details">
            <h3>Student Feedback</h3>
            <div className="number">4.8/5</div>
            <div className="stat-trend trend-up"><Users size={14} /> Excellent</div>
          </div>
          <div className="stat-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}><Star size={24} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-details">
            <h3>Next Review</h3>
            <div className="number">June 15</div>
            <div className="stat-trend" style={{ color: 'var(--text-muted)' }}>Annual Cycle</div>
          </div>
          <div className="stat-icon" style={{ background: '#f8fafc', color: '#64748b' }}><ClipboardCheck size={24} /></div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 className="card-title" style={{ width: '100%', marginBottom: '1.5rem' }}>Performance Analysis</h3>
          <div style={{ height: '350px', width: '100%' }}>
            <Radar data={radarData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        
        <div className="table-card">
          <div className="card-header">
            <h3 className="card-title">Recent Appraisals</h3>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Faculty</th>
                  <th>Year</th>
                  <th>API Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Loading data...</td></tr>
                ) : appraisals.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No appraisals found.</td></tr>
                ) : appraisals.map((a, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{a.faculty?.user?.name || 'Faculty Name'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{a.faculty?.department}</div>
                    </td>
                    <td>{a.academicYear}</td>
                    <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{a.apiScore}</td>
                    <td>
                      <span className={`status-badge status-${a.status}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Self Assessment Modal */}
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
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Self-Assessment Form</h2>
              <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Academic Year</label>
                  <select 
                    value={formData.academicYear}
                    onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: '10px' }}
                  >
                    <option value="2024-25">2024-25</option>
                    <option value="2025-26">2025-26</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>API Score</label>
                  <input 
                    type="number" 
                    value={formData.apiScore}
                    onChange={(e) => setFormData({...formData, apiScore: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: '10px' }} 
                    placeholder="e.g. 150"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Research Score</label>
                  <input 
                    type="number" 
                    value={formData.researchScore}
                    onChange={(e) => setFormData({...formData, researchScore: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: '10px' }} 
                    placeholder="e.g. 50"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Student Feedback</label>
                  <input 
                    type="number" 
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.studentFeedback}
                    onChange={(e) => setFormData({...formData, studentFeedback: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: '10px' }} 
                    placeholder="Rating (1-5)"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Additional Comments</label>
                <textarea 
                  value={formData.comments}
                  onChange={(e) => setFormData({...formData, comments: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: '10px', minHeight: '80px' }} 
                  placeholder="Summarize your achievements..."
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
                >Submit Appraisal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceAppraisal;
