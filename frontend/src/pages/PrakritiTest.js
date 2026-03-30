import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API, useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PrakritiTest = () => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { updateUser, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/prakriti/questions').then(r => setQuestions(r.data));
  }, []);

  const handleAnswer = (option) => {
    const newAnswers = [...answers, { questionId: questions[current].id, dosha: option.dosha, score: option.score }];
    setAnswers(newAnswers);
    
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      submitAssessment(newAnswers);
    }
  };

  const submitAssessment = async (finalAnswers) => {
    setLoading(true);
    try {
      const { data } = await API.post('/prakriti/assess', { answers: finalAnswers });
      setResult(data);
      updateUser({ ...user, prakriti: data.prakriti });
      toast.success('Prakriti assessed! 🌺');
    } catch (err) {
      toast.error('Assessment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const progress = ((current) / Math.max(questions.length, 1)) * 100;

  if (loading) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: '5rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌀</div>
      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#2D5016' }}>Analyzing your constitution...</h2>
    </div>
  );

  if (result) return (
    <div className="page" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
          {result.prakriti?.includes('vata') ? '🌬️' : result.prakriti?.includes('pitta') ? '🔥' : '🌊'}
        </div>
        <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6B5A3E', marginBottom: '0.5rem' }}>Your Prakriti</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', color: '#2D5016', textTransform: 'capitalize', marginBottom: '0.5rem' }}>
          {result.prakriti} Dosha
        </h1>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', margin: '2rem 0', flexWrap: 'wrap' }}>
          {Object.entries(result.scores).map(([dosha, pct]) => (
            <div key={dosha} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontFamily: 'Cormorant Garamond, serif', color: dosha === 'vata' ? '#7C3AED' : dosha === 'pitta' ? '#C4622D' : '#2D5016' }}>
                {pct}%
              </div>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B5A3E' }}>{dosha}</div>
              <div className="progress-bar" style={{ width: '80px', marginTop: '0.5rem' }}>
                <div className="progress-fill" style={{ width: `${pct}%`, background: dosha === 'vata' ? '#7C3AED' : dosha === 'pitta' ? '#C4622D' : '#2D5016' }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/diet-plan')} className="btn btn-primary">View My Diet Plan →</button>
          <button onClick={() => { setResult(null); setCurrent(0); setAnswers([]); }} className="btn btn-outline">Retake Test</button>
        </div>
      </div>
    </div>
  );

  if (!questions.length) return <div className="loader">Loading questions...</div>;

  const q = questions[current];

  return (
    <div className="page" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h1 className="page-title">Prakriti Assessment</h1>
      <p className="page-subtitle">Discover your unique Ayurvedic body constitution</p>
      
      {/* Progress */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#6B5A3E' }}>Question {current + 1} of {questions.length}</span>
          <span style={{ fontSize: '0.85rem', color: '#6B5A3E' }}>{Math.round(progress)}% complete</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="card">
        <div style={{ marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B5A3E', background: 'rgba(212, 160, 23, 0.12)', padding: '0.2rem 0.6rem', borderRadius: '50px' }}>
            {q.category}
          </span>
        </div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: '#1A1208', margin: '1rem 0 1.5rem' }}>
          {q.question}
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {q.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(option)}
              style={{
                padding: '1rem 1.25rem',
                border: '1.5px solid rgba(212, 160, 23, 0.25)',
                borderRadius: '12px',
                background: 'rgba(253, 246, 227, 0.5)',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.95rem',
                color: '#1A1208',
                transition: 'all 0.15s',
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = '#E8841A'; e.currentTarget.style.background = 'rgba(232, 132, 26, 0.08)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(212, 160, 23, 0.25)'; e.currentTarget.style.background = 'rgba(253, 246, 227, 0.5)'; }}
            >
              <span style={{ marginRight: '0.75rem', opacity: 0.5 }}>{['A', 'B', 'C'][i]}.</span>
              {option.text}
            </button>
          ))}
        </div>
      </div>

      {current > 0 && (
        <button onClick={() => { setAnswers(answers.slice(0, -1)); setCurrent(current - 1); }} className="btn btn-outline" style={{ marginTop: '1rem' }}>
          ← Previous
        </button>
      )}
    </div>
  );
};

export default PrakritiTest;
