import React from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { 
  Users, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  MoreVertical, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  // Chart configurations
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { drawBorder: false, color: '#f1f5f9' } },
      x: { grid: { display: false } }
    }
  };

  const workloadData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [{
      label: 'Avg Workload (hrs)',
      data: [6.5, 7.2, 5.8, 8.1, 6.9, 4.2],
      backgroundColor: '#3b82f6',
      borderRadius: 6
    }]
  };

  const deptData = {
    labels: ['CSE', 'ECE', 'ME', 'CE', 'IT'],
    datasets: [{
      data: [45, 30, 25, 20, 35],
      backgroundColor: ['#1e293b', '#3b82f6', '#94a3b8', '#cbd5e1', '#64748b'],
      borderWidth: 0
    }]
  };

  const stats = [
    { label: 'Total Faculty', value: '184', trend: '+12%', up: true, icon: <Users size={24} />, color: '#eff6ff', iconColor: '#3b82f6' },
    { label: 'Avg Workload', value: '18.5h', trend: '-2.4%', up: false, icon: <Clock size={24} />, color: '#fff7ed', iconColor: '#f59e0b' },
    { label: 'Publications', value: '42', trend: '+8.2%', up: true, icon: <BookOpen size={24} />, color: '#f0fdf4', iconColor: '#10b981' },
    { label: 'Efficiency', value: '94%', trend: '+4.1%', up: true, icon: <TrendingUp size={24} />, color: '#faf5ff', iconColor: '#a855f7' }
  ];

  const facultyData = [
    { id: 1, name: 'Dr. Sarah Johnson', dept: 'CSE', role: 'Associate Prof.', workload: '16h', status: 'Active' },
    { id: 2, name: 'Prof. Michael Chen', dept: 'ECE', role: 'Professor', workload: '18h', status: 'Active' },
    { id: 3, name: 'Dr. Emily Brown', dept: 'ME', role: 'Assistant Prof.', workload: '12h', status: 'Pending' },
    { id: 4, name: 'Robert Wilson', dept: 'CE', role: 'Lecturer', workload: '20h', status: 'Active' },
  ];

  return (
    <div className="fade-in">
      {/* Analytics Cards */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-details">
              <h3>{stat.label}</h3>
              <div className="number">{stat.value}</div>
              <div className={`stat-trend ${stat.up ? 'trend-up' : 'trend-down'}`}>
                {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend} <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>vs last month</span>
              </div>
            </div>
            <div className="stat-icon" style={{ backgroundColor: stat.color, color: stat.iconColor }}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 className="card-title">Weekly Average Workload</h3>
            <select style={{ border: 'none', background: 'none', color: 'var(--text-muted)', fontSize: '0.875rem', outline: 'none' }}>
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div style={{ height: '300px' }}>
            <Bar data={workloadData} options={barOptions} />
          </div>
        </div>
        <div className="chart-card">
          <h3 className="card-title" style={{ marginBottom: '1.5rem' }}>Dept. Distribution</h3>
          <div style={{ height: '240px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={deptData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>
      </div>

      {/* Faculty Table */}
      <div className="table-card">
        <div className="card-header">
          <h3 className="card-title">Recent Faculty Activities</h3>
          <button style={{ 
            padding: '0.5rem 1rem', 
            background: 'var(--bg-main)', 
            border: '1px solid var(--border)', 
            borderRadius: '8px', 
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}>View All</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Faculty Name</th>
              <th>Department</th>
              <th>Role</th>
              <th>Workload</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {facultyData.map((faculty) => (
              <tr key={faculty.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.75rem' }}>
                      {faculty.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span style={{ fontWeight: 600 }}>{faculty.name}</span>
                  </div>
                </td>
                <td>{faculty.dept}</td>
                <td>{faculty.role}</td>
                <td>{faculty.workload}</td>
                <td>
                  <span className={`status-badge ${faculty.status === 'Active' ? 'status-active' : 'status-pending'}`}>
                    {faculty.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    onClick={() => alert(`Actions for ${faculty.name}`)}
                    className="action-btn"
                    style={{ border: 'none', background: 'none' }}
                  >
                    <MoreVertical size={16} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
