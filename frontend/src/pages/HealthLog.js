import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { API } from '../context/AuthContext';
import toast from 'react-hot-toast';

const HealthLog = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [form, setForm] = useState({ energy: 7, digestion: 7, sleep: 7, mood: 7, water: 8, symptoms: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('log');

  const fetchData = () => {
    API.get('/health-logs').then(r => setLogs(r.data)).catch(() => {});
    API.get('/health-logs/stats').then(r => setStats(r.data)).catch(() => {});
  };

  useEffect(fetchData, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, symptoms: form.symptoms ? form.symptoms.split(',').map(s => s.trim()) : [] };
      await API.post('/health-logs', payload);
      toast.success('Health log saved! 🌿');
      setForm({ energy: 7, digestion: 7, sleep: 7, mood: 7, water: 8, symptoms: '', notes: '' });
      fetchData();
      setTab('history');
    } catch (err) {
      toast.error('Failed to save log');
    } finally {
      setSaving(false);
    }
  };

  const chartData = logs.slice(0, 7).reverse().map(l => ({
    date: new Date(l.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    Energy: l.energy,
    Digestion: l.digestion,
    Sleep: l.sleep,
    Mood: l.mood
  }));

  const Slider = ({ label, emoji, name }) => (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <label style={{ fontSize: '0.9rem', color: '#1A1208', fontWeight: 500 }}>{emoji} {label}</label>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#E8841A', fontWeight: 500 }}>{form[name]}/10</span>
      </div>
      <input
        type="range" min="1" max="10" value={form[name]}
        onChange={e => setForm({ ...form, [name]: parseInt(e.target.value) })}
        style={{ width: '100%', accentColor: '#E8841A', cursor: 'pointer' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#6B5A3E' }}>
        <span>Poor</span><span>Excellent</span>
      </div>
    </div>
  );

  return (
    <div className="page">
      <h1 className="page-title">Health Tracker</h1>
      <p className="page-subtitle">Monitor your daily wellness journey</p>

      {/* Stats Summary */}
      {stats && stats.avgEnergy && (
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          {[
            { label: 'Avg Energy', value: stats.avgEnergy, emoji: '⚡' },
            { label: 'Avg Digestion', value: stats.avgDigestion, emoji: '🌱' },
            { label: 'Avg Sleep', value: stats.avgSleep, emoji: '🌙' },
            { label: 'Avg Mood', value: stats.avgMood, emoji: '😊' },
          ].map(s => (
            <div key={s.label} className="card stat-box">
              <div style={{ fontSize: '1.5rem' }}>{s.emoji}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['log', 'history', 'chart'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`btn ${tab === t ? 'btn-primary' : 'btn-outline'}`} style={{ textTransform: 'capitalize' }}>
            {t === 'log' ? '📝 Log Today' : t === 'history' ? '📜 History' : '📈 Chart'}
          </button>
        ))}
      </div>

      {/* Log Form */}
      {tab === 'log' && (
        <div className="card" style={{ maxWidth: '640px' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#2D5016', marginBottom: '1.5rem' }}>
            Today's Health Check-in
          </h2>
          <form onSubmit={handleSubmit}>
            <Slider label="Energy Level" emoji="⚡" name="energy" />
            <Slider label="Digestion Quality" emoji="🌱" name="digestion" />
            <Slider label="Sleep Quality" emoji="🌙" name="sleep" />
            <Slider label="Mood" emoji="😊" name="mood" />
            
            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label>Glasses of Water Consumed</label>
              <input type="number" value={form.water} onChange={e => setForm({ ...form, water: parseInt(e.target.value) })} min="0" max="20" />
            </div>
            <div className="form-group">
              <label>Symptoms (comma-separated)</label>
              <input value={form.symptoms} onChange={e => setForm({ ...form, symptoms: e.target.value })} placeholder="fatigue, bloating, headache..." />
            </div>
            <div className="form-group">
              <label>Additional Notes</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="How are you feeling today..." rows="3" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : '✨ Save Today\'s Log'}
            </button>
          </form>
        </div>
      )}

      {/* History */}
      {tab === 'history' && (
        <div>
          {logs.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: '#6B5A3E' }}>No health logs yet. Start logging your daily wellness!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {logs.map((log, i) => (
                <div key={i} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: '#2D5016' }}>
                      {new Date(log.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </h3>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    {[['⚡ Energy', log.energy], ['🌱 Digestion', log.digestion], ['🌙 Sleep', log.sleep], ['😊 Mood', log.mood], ['💧 Water', `${log.water}g`]].map(([l, v]) => (
                      <div key={l} style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: '#E8841A' }}>{v}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6B5A3E' }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  {log.symptoms?.length > 0 && (
                    <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {log.symptoms.map((s, si) => (
                        <span key={si} style={{ background: 'rgba(196, 98, 45, 0.1)', color: '#C4622D', padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.75rem' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Chart */}
      {tab === 'chart' && chartData.length > 0 && (
        <div className="card">
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#2D5016', marginBottom: '1.5rem' }}>
            Last 7 Days Wellness Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212, 160, 23, 0.15)" />
              <XAxis dataKey="date" style={{ fontSize: '0.8rem' }} />
              <YAxis domain={[0, 10]} style={{ fontSize: '0.8rem' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Energy" stroke="#E8841A" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Digestion" stroke="#2D5016" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Sleep" stroke="#7C3AED" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Mood" stroke="#C4622D" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default HealthLog;
