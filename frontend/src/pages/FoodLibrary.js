import React, { useEffect, useState } from 'react';
import { API } from '../context/AuthContext';

const energyColors = { heating: '#C4622D', cooling: '#2D5016', neutral: '#6B5A3E' };

const FoodLibrary = () => {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [filterDosha, setFilterDosha] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    API.get('/foods').then(r => setFoods(r.data)).catch(() => {});
  }, []);

  const filtered = foods.filter(f => {
    const matchSearch = f.name?.toLowerCase().includes(search.toLowerCase());
    const matchDosha = !filterDosha || f.dosha?.[filterDosha] === 'decreases';
    const matchCat = !filterCategory || f.category === filterCategory;
    return matchSearch && matchDosha && matchCat;
  });

  const categories = [...new Set(foods.map(f => f.category))];

  return (
    <div className="page">
      <h1 className="page-title">Ayurvedic Food Library</h1>
      <p className="page-subtitle">Explore foods and their effects on your doshas</p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search foods..."
          style={{ padding: '0.7rem 1rem', border: '1.5px solid rgba(212, 160, 23, 0.25)', borderRadius: '50px', fontFamily: 'Jost, sans-serif', fontSize: '0.9rem', background: 'rgba(253, 246, 227, 0.8)', outline: 'none', minWidth: '220px' }}
        />
        <select value={filterDosha} onChange={e => setFilterDosha(e.target.value)}
          style={{ padding: '0.7rem 1rem', border: '1.5px solid rgba(212, 160, 23, 0.25)', borderRadius: '50px', fontFamily: 'Jost, sans-serif', fontSize: '0.9rem', background: 'rgba(253, 246, 227, 0.8)', cursor: 'pointer' }}>
          <option value="">All Doshas</option>
          <option value="vata">Good for Vata 🌬️</option>
          <option value="pitta">Good for Pitta 🔥</option>
          <option value="kapha">Good for Kapha 🌊</option>
        </select>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          style={{ padding: '0.7rem 1rem', border: '1.5px solid rgba(212, 160, 23, 0.25)', borderRadius: '50px', fontFamily: 'Jost, sans-serif', fontSize: '0.9rem', background: 'rgba(253, 246, 227, 0.8)', cursor: 'pointer' }}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
      </div>

      {/* Foods Grid */}
      <div className="grid-3">
        {filtered.map((food, i) => (
          <div key={i} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#1A1208' }}>{food.name}</h3>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: energyColors[food.energy] || '#6B5A3E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {food.energy === 'heating' ? '🔥' : food.energy === 'cooling' ? '❄️' : '⚖️'} {food.energy}
              </span>
            </div>
            
            {food.category && (
              <span style={{ display: 'inline-block', background: 'rgba(212, 160, 23, 0.12)', color: '#92400E', padding: '0.15rem 0.6rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                {food.category}
              </span>
            )}

            {/* Dosha Effects */}
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              {food.dosha && Object.entries(food.dosha).map(([d, effect]) => (
                <span key={d} style={{
                  fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '50px', fontWeight: 500,
                  background: effect === 'decreases' ? 'rgba(45, 80, 22, 0.12)' : effect === 'increases' ? 'rgba(196, 98, 45, 0.12)' : 'rgba(107, 90, 62, 0.12)',
                  color: effect === 'decreases' ? '#2D5016' : effect === 'increases' ? '#C4622D' : '#6B5A3E'
                }}>
                  {effect === 'decreases' ? '↓' : effect === 'increases' ? '↑' : '='} {d.charAt(0).toUpperCase() + d.slice(1)}
                </span>
              ))}
            </div>

            {/* Benefits */}
            {food.benefits?.length > 0 && (
              <div style={{ borderTop: '1px solid rgba(212, 160, 23, 0.15)', paddingTop: '0.75rem' }}>
                {food.benefits.slice(0, 2).map((b, bi) => (
                  <p key={bi} style={{ fontSize: '0.8rem', color: '#6B5A3E', display: 'flex', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <span style={{ color: '#E8841A' }}>✦</span> {b}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#6B5A3E' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌿</div>
          <p>No foods found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default FoodLibrary;
