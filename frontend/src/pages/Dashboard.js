import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, API } from '../context/AuthContext';

const doshaInfo = {
  vata: { emoji: '🌬️', color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.08)', desc: 'Air & Space — Creative, quick, adaptable' },
  pitta: { emoji: '🔥', color: '#C4622D', bg: 'rgba(196, 98, 45, 0.08)', desc: 'Fire & Water — Sharp, intelligent, ambitious' },
  kapha: { emoji: '🌊', color: '#2D5016', bg: 'rgba(45, 80, 22, 0.08)', desc: 'Earth & Water — Stable, loving, nurturing' },
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [seasonal, setSeasonal] = useState(null);
  const prakritiKey = user?.prakriti?.split('-')[0];
  const dosha = doshaInfo[prakritiKey] || null;

  useEffect(() => {
    API.get('/health-logs/stats').then(r => setStats(r.data)).catch(() => {});
    API.get('/diet/seasonal').then(r => setSeasonal(r.data)).catch(() => {});
  }, []);

  const quickActions = [
    { label: 'Take Prakriti Test', path: '/prakriti', emoji: '🔬', desc: 'Discover your body type' },
    { label: 'View Diet Plan', path: '/diet-plan', emoji: '🌿', desc: 'Personalized meal plan' },
    { label: 'Food Library', path: '/foods', emoji: '🥗', desc: 'Ayurvedic foods database' },
    { label: 'Log Today\'s Health', path: '/health-log', emoji: '📊', desc: 'Track your wellness' },
    { label: 'Seasonal Guide', path: '/seasonal', emoji: '🍂', desc: 'Eat with the seasons' },
    { label: 'Edit Profile', path: '/profile', emoji: '👤', desc: 'Update your details' },
  ];

  return (
    <div className="page">
      {/* Hero */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="page-title">
          Namaste, {user?.name?.split(' ')[0]} 🙏
        </h1>
        <p className="page-subtitle">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Prakriti Card */}
      {user?.prakriti ? (
        <div className="card" style={{ marginBottom: '2rem', background: dosha?.bg, borderColor: `${dosha?.color}30` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <span style={{ fontSize: '3rem' }}>{dosha?.emoji}</span>
              <div>
                <p style={{ fontSize: '0.8rem', color: '#6B5A3E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Your Prakriti</p>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: dosha?.color, textTransform: 'capitalize' }}>
                  {user.prakriti} Dosha
                </h2>
                <p style={{ color: '#6B5A3E', fontSize: '0.9rem' }}>{dosha?.desc}</p>
              </div>
            </div>
            <Link to="/diet-plan" className="btn btn-primary">View My Diet Plan →</Link>
          </div>
        </div>
      ) : (
        <div className="card alert-info" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: '#2D5016', marginBottom: '0.3rem' }}>
                🔬 Discover Your Prakriti
              </h3>
              <p style={{ color: '#6B5A3E', fontSize: '0.9rem' }}>Take our 10-question assessment to unlock your personalized Ayurvedic diet plan</p>
            </div>
            <Link to="/prakriti" className="btn btn-primary">Take Test →</Link>
          </div>
        </div>
      )}

      {/* Stats Row */}
      {stats && stats.totalLogs > 0 && (
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          {[
            { label: 'Energy', value: stats.avgEnergy, emoji: '⚡' },
            { label: 'Digestion', value: stats.avgDigestion, emoji: '🌱' },
            { label: 'Sleep', value: stats.avgSleep, emoji: '🌙' },
            { label: 'Mood', value: stats.avgMood, emoji: '😊' },
          ].map(s => (
            <div key={s.label} className="card stat-box">
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{s.emoji}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label} /10</div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', color: '#2D5016', marginBottom: '1.25rem' }}>
        Quick Actions
      </h2>
      <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
        {quickActions.map(action => (
          <Link key={action.path} to={action.path} className="card" style={{ cursor: 'pointer' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{action.emoji}</div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: '#2D5016', marginBottom: '0.25rem' }}>
              {action.label}
            </h3>
            <p style={{ color: '#6B5A3E', fontSize: '0.85rem' }}>{action.desc}</p>
          </Link>
        ))}
      </div>

      {/* Seasonal Tip */}
      {seasonal && (
        <div className="card" style={{ background: 'rgba(45, 80, 22, 0.06)', borderColor: 'rgba(45, 80, 22, 0.2)' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '2rem' }}>🍂</span>
            <div>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B5A3E', marginBottom: '0.25rem' }}>
                {seasonal.season?.toUpperCase()} SEASON TIP
              </p>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: '#2D5016', marginBottom: '0.5rem' }}>
                {seasonal.focus}
              </h3>
              <p style={{ color: '#6B5A3E', fontSize: '0.85rem' }}>
                Focus foods this season: {seasonal.foods?.slice(0, 4).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
