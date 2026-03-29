import React, { useEffect, useState } from 'react';
import { API } from '../context/AuthContext';

const seasonData = {
  spring: { emoji: '🌸', color: '#E8841A', bg: 'rgba(232, 132, 26, 0.06)' },
  summer: { emoji: '☀️', color: '#C4622D', bg: 'rgba(196, 98, 45, 0.06)' },
  monsoon: { emoji: '🌧️', color: '#2D5016', bg: 'rgba(45, 80, 22, 0.06)' },
  autumn: { emoji: '🍂', color: '#D4A017', bg: 'rgba(212, 160, 23, 0.06)' },
  winter: { emoji: '❄️', color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.06)' },
};

const SeasonalGuide = () => {
  const [seasonal, setSeasonal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/diet/seasonal')
      .then(r => { setSeasonal(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader">Loading...</div>;
  if (!seasonal) return null;

  const info = seasonData[seasonal.season] || seasonData.spring;

  return (
    <div className="page">
      <h1 className="page-title">Seasonal Guide</h1>
      <p className="page-subtitle">Eating in harmony with nature's rhythms</p>

      {/* Current Season */}
      <div className="card" style={{ marginBottom: '2rem', background: info.bg, borderColor: `${info.color}30` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '4rem' }}>{info.emoji}</span>
          <div>
            <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B5A3E', marginBottom: '0.25rem' }}>
              Current Season
            </p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: info.color, textTransform: 'capitalize', marginBottom: '0.25rem' }}>
              {seasonal.season}
            </h2>
            <p style={{ color: '#1A1208', fontWeight: 500 }}>Focus: {seasonal.focus}</p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Foods to Eat */}
        <div className="card">
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: '#2D5016', marginBottom: '1rem' }}>
            ✅ Seasonal Foods to Favor
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {seasonal.foods?.map((food, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem', background: 'rgba(45, 80, 22, 0.05)', borderRadius: '8px' }}>
                <span style={{ color: '#2D5016', fontWeight: 600 }}>✦</span>
                <span style={{ fontSize: '0.9rem', color: '#1A1208' }}>{food}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Foods to Avoid */}
        <div className="card">
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: '#C4622D', marginBottom: '1rem' }}>
            ⚠️ Foods to Minimize This Season
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {seasonal.avoid?.map((food, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem', background: 'rgba(196, 98, 45, 0.05)', borderRadius: '8px' }}>
                <span style={{ color: '#C4622D', fontWeight: 600 }}>✗</span>
                <span style={{ fontSize: '0.9rem', color: '#1A1208' }}>{food}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lifestyle Tips */}
      {seasonal.lifestyle && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: '#2D5016', marginBottom: '1rem' }}>
            🧘 Seasonal Lifestyle Practices
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {seasonal.lifestyle.map((tip, i) => (
              <div key={i} style={{ padding: '0.75rem 1rem', background: 'rgba(212, 160, 23, 0.08)', borderRadius: '10px', border: '1px solid rgba(212, 160, 23, 0.2)' }}>
                <span style={{ fontSize: '0.9rem', color: '#1A1208' }}>🌟 {tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Seasons Overview */}
      <div style={{ marginTop: '2.5rem' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', color: '#2D5016', marginBottom: '1.25rem' }}>
          Ayurvedic Seasonal Calendar
        </h2>
        <div className="grid-3">
          {Object.entries(seasonData).map(([season, info]) => (
            <div key={season} className="card" style={{ background: season === seasonal.season ? info.bg : undefined, borderColor: season === seasonal.season ? `${info.color}30` : undefined }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{info.emoji}</span>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: info.color, textTransform: 'capitalize' }}>
                  {season}
                  {season === seasonal.season && <span style={{ fontSize: '0.7rem', background: info.color, color: 'white', padding: '0.1rem 0.5rem', borderRadius: '50px', marginLeft: '0.5rem' }}>Now</span>}
                </h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#6B5A3E' }}>
                {season === 'spring' ? 'Cleanse & renew with light, bitter foods' :
                 season === 'summer' ? 'Cool with sweet, hydrating foods' :
                 season === 'monsoon' ? 'Strengthen digestion with warming spices' :
                 season === 'autumn' ? 'Nourish with sweet, bitter, astringent foods' :
                 'Fortify with heavy, warming, oily foods'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeasonalGuide;
