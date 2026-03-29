import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', gender: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.age, form.gender);
      toast.success('Account created! Begin your journey 🌺');
      navigate('/prakriti');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-panel-left">
        <div style={{ textAlign: 'center', color: 'white', zIndex: 1, position: 'relative' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌿</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 300, marginBottom: '1rem' }}>
            Begin Your Journey
          </h1>
          <p style={{ opacity: 0.8, lineHeight: 1.7, maxWidth: '300px' }}>
            Ayurveda teaches us that each person is unique. Your personalized wellness journey starts with understanding your Prakriti — your inherent constitution.
          </p>
          <div style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', maxWidth: '280px', margin: '2rem auto 0' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontStyle: 'italic', opacity: 0.9 }}>
              "Let food be thy medicine and medicine be thy food"
            </p>
            <p style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.5rem' }}>— Ancient Ayurvedic Wisdom</p>
          </div>
        </div>
      </div>
      
      <div className="auth-panel-right">
        <div className="auth-form-box">
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: '#2D5016', marginBottom: '0.5rem' }}>
            Create Account
          </h2>
          <p style={{ color: '#6B5A3E', marginBottom: '2rem', fontSize: '0.9rem' }}>
            Join thousands on their Ayurvedic wellness journey
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Age</label>
                <input type="number" name="age" value={form.age} onChange={handleChange} placeholder="Age" min="10" max="100" />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required minLength={6} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Start My Journey 🌺'}
            </button>
          </form>
          
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6B5A3E', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#E8841A', fontWeight: 500 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
