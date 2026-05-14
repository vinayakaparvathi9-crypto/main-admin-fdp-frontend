import React, { useState, useEffect } from 'react';
import API from '../api';
import { 
  Building2, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Plus,
  ArrowUpRight,
  User,
  MoreVertical,
  X,
  Code,
  DollarSign
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    budget: '',
  });

  const fetchDepartments = async () => {
    try {
      const { data } = await API.get('/departments');
      setDepartments(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/departments', formData);
      setShowModal(false);
      setFormData({ name: '', code: '', description: '', budget: '' });
      fetchDepartments();
    } catch (error) {
      console.error('Error creating department:', error);
      alert('Error creating department');
    }
  };

  const chartData = {
    labels: departments.map(d => d.code),
    datasets: [{
      label: 'Faculty Count',
      data: departments.map(d => d.facultyCount || 0),
      backgroundColor: '#3b82f6',
      borderRadius: 8
    }]
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Department Analytics</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Track department performance and resource allocation.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="action-btn" 
          style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', width: 'auto', borderRadius: '10px' }}
        >
          <Plus size={20} style={{ marginRight: '0.5rem' }} /> Add Department
        </button>
      </div>

      <div className="stats-grid">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', width: '100%', color: 'var(--text-muted)' }}>Loading departments...</div>
        ) : departments.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', width: '100%', color: 'var(--text-muted)' }}>No departments found. Add one to get started!</div>
        ) : (
          departments.map((dept, i) => (
            <div key={i} className="stat-card">
              <div className="stat-details">
                <h3 style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{dept.name}</h3>
                <div className="number">{dept.facultyCount} Faculty</div>
                <div className="stat-trend trend-up">
                  <Users size={14} /> {dept.stats?.studentCount || 0} Students
                </div>
              </div>
              <div className="stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                <Building2 size={24} />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="charts-grid" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
        <div className="chart-card">
          <h3 className="card-title" style={{ marginBottom: '1.5rem' }}>Faculty Distribution by Department</h3>
          <div style={{ height: '300px' }}>
            <Bar data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </div>
        
        <div className="chart-card">
          <h3 className="card-title" style={{ marginBottom: '1.5rem' }}>Department Heads</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {departments.map((dept, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderRadius: '10px', background: '#f8fafc' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={20} color="white" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{dept.hod?.name || 'Vacant'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>HOD, {dept.code}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="table-card" style={{ marginTop: '2.5rem' }}>
        <div className="card-header">
          <h3 className="card-title">Department Budgets & Resources</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Dept Name</th>
              <th>Code</th>
              <th>Budget Allocation</th>
              <th>Research Papers</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{dept.name}</td>
                <td><code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{dept.code}</code></td>
                <td>${(dept.budget || 0).toLocaleString()}</td>
                <td>{dept.stats?.researchPapers || 0} Papers</td>
                <td><button className="action-btn"><MoreVertical size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Department Modal */}
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
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Add New Department</h2>
              <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Department Name</label>
                <div style={{ position: 'relative' }}>
                  <Building2 style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid var(--border)', borderRadius: '10px' }} 
                    placeholder="Computer Science"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Dept Code</label>
                  <div style={{ position: 'relative' }}>
                    <Code style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                    <input 
                      type="text" 
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid var(--border)', borderRadius: '10px' }} 
                      placeholder="CSE"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Budget ($)</label>
                  <div style={{ position: 'relative' }}>
                    <DollarSign style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                    <input 
                      type="number" 
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid var(--border)', borderRadius: '10px' }} 
                      placeholder="500000"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: '10px', minHeight: '80px' }} 
                  placeholder="Brief description of the department..."
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
                >Create Department</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
