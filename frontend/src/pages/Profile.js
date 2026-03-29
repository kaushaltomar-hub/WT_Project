import React, { useState } from 'react';
import { useAuth, API } from '../context/AuthContext';
import toast from 'react-hot-toast';

const healthGoalOptions = ['Weight Loss', 'Weight Gain', 'Better Digestion', 'More Energy', 'Better Sleep', 'Stress Reduction', 'Immunity Boost', 'Detox'];

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    age: user?.age || '',
    gender: user?.gender || '',
    weight: user?.weight || '',
    height: user?.height || '',
    healthGoals: user?.healthGoals || [],
    allergies: user?.allergies?.join(', ') || '',
    currentHealthIssues: user?.currentHealthIssues?.join(', ') || '',
  });
  const [saving, setSaving] = useState(false);

  const toggleGoal = (goal) => {
    setForm(f => ({
      ...f,
      healthGoals: f.healthGoals.includes(goal)
        ? f.healthGoals.filter(g => g !== goal)
        : [...f.healthGoals, goal]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        allergies: form.allergies ? form.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
        currentHealthIssues: form.currentHealthIssues ? form.currentHealthIssues.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      const { data } = await API.put('/users/profile', payload);
      updateUser({ ...user, ...data });
      toast.success('Profile updated! 🌿');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const bmi = form.weight && form.height ? (form.weight / ((form.height / 100) ** 2)).toFixed(1) : null;

  return (
    <div className="page" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h1 className="page-title">My Profile</h1>
      <p className="page-subtitle">Update your health information for better recommendations</p>

      {/* Prakriti Display */}
      {user?.prakriti && (
        <div className="card" style={{ marginBottom: '2rem', background: 'rgba(45, 80, 22, 0.06)', borderColor: 'rgba(45, 80, 22, 0.2)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B5A3E', marginBottom: '0.25rem' }}>Assessed Prakriti</p>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: '#2D5016', textTransform: 'capitalize' }}>
            {user.prakriti} Dosha
          </h2>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: '#2D5016', marginBottom: '1.25rem' }}>
            Basic Information
          </h2>
          <div className="form-group">
            <label>Full Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="grid-3">
            <div className="form-group">
              <label>Age</label>
              <input type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} min="10" max="100" />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input type="number" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Height (cm)</label>
            <input type="number" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} />
          </div>
          {bmi && (
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(212, 160, 23, 0.1)', borderRadius: '10px', fontSize: '0.9rem', color: '#92400E' }}>
              📊 Your BMI: <strong>{bmi}</strong> — {bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal weight' : bmi < 30 ? 'Overweight' : 'Obese'}
            </div>
          )}
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: '#2D5016', marginBottom: '1.25rem' }}>
            Health Goals
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {healthGoalOptions.map(goal => (
              <button
                key={goal}
                type="button"
                onClick={() => toggleGoal(goal)}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '50px',
                  border: '1.5px solid',
                  cursor: 'pointer',
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.85rem',
                  transition: 'all 0.15s',
                  borderColor: form.healthGoals.includes(goal) ? '#2D5016' : 'rgba(212, 160, 23, 0.3)',
                  background: form.healthGoals.includes(goal) ? 'rgba(45, 80, 22, 0.1)' : 'transparent',
                  color: form.healthGoals.includes(goal) ? '#2D5016' : '#6B5A3E',
                  fontWeight: form.healthGoals.includes(goal) ? 500 : 400,
                }}
              >
                {form.healthGoals.includes(goal) ? '✓ ' : ''}{goal}
              </button>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: '#2D5016', marginBottom: '1.25rem' }}>
            Health Details
          </h2>
          <div className="form-group">
            <label>Food Allergies (comma-separated)</label>
            <input value={form.allergies} onChange={e => setForm({ ...form, allergies: e.target.value })} placeholder="peanuts, gluten, dairy..." />
          </div>
          <div className="form-group">
            <label>Current Health Issues (comma-separated)</label>
            <input value={form.currentHealthIssues} onChange={e => setForm({ ...form, currentHealthIssues: e.target.value })} placeholder="diabetes, hypertension, IBS..." />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : '✨ Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
