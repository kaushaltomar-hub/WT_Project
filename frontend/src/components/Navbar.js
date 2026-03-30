import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { path: '/', label: '🏠 Dashboard' },
    { path: '/prakriti', label: '🔬 Prakriti Test' },
    { path: '/diet-plan', label: '🌿 Diet Plan' },
    { path: '/foods', label: '🥗 Foods' },
    { path: '/health-log', label: '📊 Health Log' },
    { path: '/seasonal', label: '🍂 Seasonal' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.brand}>
          <span style={styles.brandEmoji}>🌺</span>
          <span style={styles.brandText}>AyurDiet</span>
        </Link>

        <div style={styles.links}>
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                ...styles.link,
                ...(location.pathname === link.path ? styles.activeLink : {})
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div style={styles.userSection}>
          {user?.prakriti && (
            <span style={styles.prakritiBadge}>{user.prakriti.toUpperCase()}</span>
          )}
          <Link to="/profile" style={styles.avatar}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: 'rgba(253, 246, 227, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(212, 160, 23, 0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 20px rgba(26, 18, 8, 0.06)'
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    height: '64px'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    marginRight: '1rem'
  },
  brandEmoji: { fontSize: '1.5rem' },
  brandText: {
    fontFamily: '"Cormorant Garamond", serif',
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#2D5016'
  },
  links: {
    display: 'flex',
    gap: '0.25rem',
    flex: 1
  },
  link: {
    padding: '0.4rem 0.75rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    color: '#6B5A3E',
    textDecoration: 'none',
    transition: 'all 0.2s',
    fontWeight: 400,
    whiteSpace: 'nowrap'
  },
  activeLink: {
    background: 'rgba(232, 132, 26, 0.12)',
    color: '#C4622D',
    fontWeight: 500
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  prakritiBadge: {
    background: 'rgba(45, 80, 22, 0.12)',
    color: '#2D5016',
    padding: '0.2rem 0.75rem',
    borderRadius: '50px',
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.1em'
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #E8841A, #C4622D)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: '0.9rem',
    textDecoration: 'none',
    cursor: 'pointer'
  },
  logoutBtn: {
    background: 'none',
    border: '1.5px solid rgba(196, 98, 45, 0.4)',
    color: '#C4622D',
    padding: '0.35rem 0.9rem',
    borderRadius: '50px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 500,
    fontFamily: 'Jost, sans-serif'
  }
};

export default Navbar;
