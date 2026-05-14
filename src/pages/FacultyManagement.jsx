import React, { useState, useEffect } from 'react';
import API from '../api';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  MoreVertical, 
  X,
  UserPlus,
  Mail,
  Briefcase,
  GraduationCap
} from 'lucide-react';

const FacultyManagement = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employeeId: '',
    designation: '',
    department: '',
    role: 'faculty'
  });

  const fetchFaculty = async () => {
    try {
      const { data } = await API.get('/faculty');
      setFacultyList(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching faculty:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      try {
        await API.delete(`/faculty/${id}`);
        fetchFaculty();
      } catch (error) {
        console.error('Error deleting faculty:', error);
      }
    }
  };

  const handleOpenModal = (faculty = null) => {
    if (faculty) {
      setEditingFaculty(faculty);
      setFormData({
        name: faculty.user?.name || '',
        email: faculty.user?.email || '',
        employeeId: faculty.employeeId || '',
        designation: faculty.designation || '',
        department: faculty.department || '',
        role: faculty.user?.role || 'faculty'
      });
    } else {
      setEditingFaculty(null);
      setFormData({
        name: '',
        email: '',
        employeeId: '',
        designation: '',
        department: '',
        role: 'faculty'
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFaculty) {
        await API.post('/faculty', { ...formData, _id: editingFaculty._id });
      } else {
        // For new faculty, we'd normally need a password too, 
        // but let's assume a default one for now or update backend
        await API.post('/faculty', formData);
      }
      setShowModal(false);
      fetchFaculty();
    } catch (error) {
      console.error('Error saving faculty:', error);
      alert('Error saving faculty details');
    }
  };

  const filteredFaculty = facultyList.filter(f => 
    f.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Faculty Directory</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Manage all faculty members and their profiles.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}
        >
          <Plus size={20} />
          <span>Add Faculty</span>
        </button>
      </div>

      <div className="table-card">
        <div className="card-header" style={{ background: 'white' }}>
          <div className="nav-search" style={{ width: '350px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by name or department..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: '1px solid var(--border)' }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading faculty data...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Faculty</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaculty.map((faculty) => (
                <tr key={faculty._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img 
                        src={`https://ui-avatars.com/api/?name=${faculty.user?.name}&background=f1f5f9&color=3b82f6`} 
                        alt="" 
                        style={{ width: '40px', height: '40px', borderRadius: '10px' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{faculty.user?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{faculty.user?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{faculty.employeeId}</code></td>
                  <td>{faculty.department}</td>
                  <td>{faculty.designation}</td>
                  <td>
                    <span className="status-badge status-active">Active</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button onClick={() => handleOpenModal(faculty)} className="action-btn" title="Edit"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(faculty._id)} className="action-btn" style={{ color: 'var(--danger)' }} title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal - Simplified for now */}
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
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{editingFaculty ? 'Edit Faculty' : 'Add New Faculty'}</h2>
              <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <UserPlus style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid var(--border)', borderRadius: '10px' }} 
                    placeholder="Dr. John Doe"
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid var(--border)', borderRadius: '10px' }} 
                    placeholder="john@college.edu"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Employee ID</label>
                  <input 
                    type="text" 
                    value={formData.employeeId}
                    onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: '10px' }} 
                    placeholder="FAC001"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Department</label>
                  <select 
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: '10px' }}
                  >
                    <option value="">Select Dept</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="ME">ME</option>
                    <option value="CE">CE</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Designation</label>
                <input 
                  type="text" 
                  value={formData.designation}
                  onChange={(e) => setFormData({...formData, designation: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: '10px' }} 
                  placeholder="Assistant Professor"
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
                >Save Details</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyManagement;
