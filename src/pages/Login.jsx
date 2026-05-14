import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Loader2, GraduationCap, ShieldCheck, UserCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('faculty');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(email, password, role);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      width: '100vw', 
      background: 'radial-gradient(circle at top right, #1e293b, #0f172a)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      overflow: 'hidden'
    }}>
      {/* Decorative Elements */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '50%', filter: 'blur(80px)' }}></div>
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px', background: 'rgba(16, 185, 129, 0.03)', borderRadius: '50%', filter: 'blur(100px)' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(12px)',
          padding: '2.5rem',
          borderRadius: '2rem',
          width: '100%',
          maxWidth: '450px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          zIndex: 10
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            style={{ 
              width: '64px', 
              height: '64px', 
              background: 'var(--accent)', 
              borderRadius: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 1.5rem',
              boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)'
            }}
          >
            <GraduationCap size={32} color="white" />
          </motion.div>
          <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>EduSmart ERP</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Access your faculty administration portal</p>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '0.75rem', borderRadius: '0.75rem', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}
          >{error}</motion.div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Role Selection */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '0.5rem' }}>
            {[
              { id: 'faculty', label: 'Faculty', icon: UserCircle },
              { id: 'hod', label: 'HOD', icon: GraduationCap },
              { id: 'admin', label: 'Admin', icon: ShieldCheck }
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: role === r.id ? 'var(--accent)' : 'rgba(255, 255, 255, 0.1)',
                  background: role === r.id ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  color: role === r.id ? 'white' : '#94a3b8',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <r.icon size={18} />
                {r.label}
              </button>
            ))}
          </div>

          <div>
            <label style={{ color: '#e2e8f0', display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@college.edu"
                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: 'white', outline: 'none', fontSize: '0.875rem' }}
                required
              />
            </div>
          </div>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ color: '#e2e8f0', fontSize: '0.875rem', fontWeight: 600 }}>Password</label>
              <a href="#" style={{ color: 'var(--accent)', fontSize: '0.75rem', textDecoration: 'none', fontWeight: 500 }}>Forgot Password?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: 'white', outline: 'none', fontSize: '0.875rem' }}
                required
              />
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              marginTop: '1rem',
              boxShadow: '0 10px 20px -5px rgba(59, 130, 246, 0.3)'
            }}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                Sign In <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b', fontSize: '0.75rem' }}>
          By logging in, you agree to the <a href="#" style={{ color: '#94a3b8', textDecoration: 'underline' }}>Terms of Service</a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
