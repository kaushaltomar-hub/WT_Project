import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API, useAuth } from '../context/AuthContext';

const mealOrder = ['earlyMorning', 'breakfast', 'midMorning', 'lunch', 'eveningSnack', 'dinner'];
const mealEmojis = { earlyMorning: '🌅', breakfast: '🍳', midMorning: '🫖', lunch: '🍛', eveningSnack: '☕', dinner: '🌙' };

const DietPlan = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    API.get('/diet/plan')
      .then(r => { setPlan(r.data); setLoading(false); })
      .catch(err => { setError(err.response?.data?.message || 'Failed to load'); setLoading(false); });
  }, []);

  if (loading) return <div className="loader">Loading your plan...</div>;
  
  if (error) return (
    <div className="page" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', paddingTop: '3rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌿</div>
      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#2D5016', marginBottom: '1rem' }}>
        Complete Your Prakriti Assessment First
      </h2>
      <p style={{ color: '#6B5A3E', marginBottom: '2rem' }}>We need to know your body constitution to generate your personalized diet plan.</p>
      <Link to="/prakriti" className="btn btn-primary">Take Prakriti Test →</Link>
    </div>
  );

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Your Diet Plan</h1>
          <p className="page-subtitle">Personalized for <strong style={{ color: '#C4622D', textTransform: 'capitalize' }}>{plan?.prakriti} Dosha</strong></p>
        </div>
      </div>

      {/* Principles */}
      <div className="card" style={{ marginBottom: '2rem', background: 'rgba(45, 80, 22, 0.05)', borderColor: 'rgba(45, 80, 22, 0.2)' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#2D5016', marginBottom: '1rem' }}>
          🧘 Core Principles for Your Constitution
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
          {plan?.principles?.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ color: '#E8841A', marginTop: '2px', flexShrink: 0 }}>✦</span>
              <span style={{ fontSize: '0.9rem', color: '#1A1208' }}>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Meals */}
      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', color: '#2D5016', marginBottom: '1.25rem' }}>
        🍽️ Daily Meal Schedule
      </h2>
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {mealOrder.map(mealKey => {
          const meal = plan?.meals?.[mealKey];
          if (!meal) return null;
          return (
            <div key={mealKey} className="card">
              <div className="meal-time">{meal.time}</div>
              <div className="meal-name">{mealEmojis[mealKey]} {meal.name}</div>
              <div style={{ marginBottom: '1rem' }}>
                {meal.foods?.map((food, i) => (
                  <div key={i} className="food-item">
                    <span className="food-dot" />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{food.foodName}</span>
                      <span style={{ color: '#6B5A3E', fontSize: '0.8rem', marginLeft: '0.5rem' }}>({food.quantity})</span>
                    </div>
                  </div>
                ))}
              </div>
              {meal.benefits && (
                <div style={{ fontSize: '0.8rem', color: '#2D5016', background: 'rgba(45, 80, 22, 0.07)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                  💚 {meal.benefits}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Herbs */}
      {plan?.herbs?.length > 0 && (
        <>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', color: '#2D5016', marginBottom: '1.25rem' }}>
            🌿 Recommended Herbs & Supplements
          </h2>
          <div className="grid-3" style={{ marginBottom: '2rem' }}>
            {plan.herbs.map((herb, i) => (
              <div key={i} className="card" style={{ background: 'rgba(107, 143, 71, 0.08)', borderColor: 'rgba(107, 143, 71, 0.25)' }}>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: '#2D5016', marginBottom: '0.5rem' }}>
                  🌱 {herb.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#1A1208', marginBottom: '0.25rem' }}>{herb.usage}</p>
                <p style={{ fontSize: '0.8rem', color: '#6B5A3E' }}>⏰ {herb.timing}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Foods to Avoid */}
      {plan?.avoid?.length > 0 && (
        <div className="card" style={{ background: 'rgba(196, 98, 45, 0.04)', borderColor: 'rgba(196, 98, 45, 0.2)' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#C4622D', marginBottom: '1rem' }}>
            ⚠️ Foods to Minimize
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {plan.avoid.map((item, i) => (
              <span key={i} style={{ background: 'rgba(196, 98, 45, 0.1)', color: '#C4622D', padding: '0.3rem 0.75rem', borderRadius: '50px', fontSize: '0.85rem' }}>
                ✗ {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DietPlan;
