import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back! 🌿');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-panel-left">
        <div style={{ textAlign: 'center', color: 'white', zIndex: 1, position: 'relative' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌺</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 300, marginBottom: '1rem' }}>
            AyurDiet
          </h1>
          <p style={{ opacity: 0.8, lineHeight: 1.7, maxWidth: '300px' }}>
            Ancient wisdom meets modern wellness. Discover your unique body constitution and unlock a personalized diet plan rooted in Ayurvedic science.
          </p>
          <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            {['Vata', 'Pitta', 'Kapha'].map(d => (
              <div key={d} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                  {d === 'Vata' ? '🌬️' : d === 'Pitta' ? '🔥' : '🌊'}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="auth-panel-right">
        <div className="auth-form-box">
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: '#2D5016', marginBottom: '0.5rem' }}>
            Welcome Back
          </h2>
          <p style={{ color: '#6B5A3E', marginBottom: '2rem', fontSize: '0.9rem' }}>
            Sign in to access your Ayurvedic wellness journey
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In 🌿'}
            </button>
          </form>
          
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6B5A3E', fontSize: '0.9rem' }}>
            New to AyurDiet?{' '}
            <Link to="/register" style={{ color: '#E8841A', fontWeight: 500 }}>Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
