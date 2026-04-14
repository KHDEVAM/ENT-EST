import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  const handleLogout = () => {
    logout();  // Cette fonction existe dans api.js
    // La redirection se fait dans logout() avec window.location.href
  };

  if (!user) {
    return <div style={styles.loading}>Chargement...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Barre de navigation */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>🎓 ENT EST Salé</div>
        <div style={styles.navLinks}>
          <button onClick={() => navigate('/dashboard')} style={styles.navButton}>Dashboard</button>
          <button onClick={() => navigate('/courses')} style={styles.navButton}>Mes cours</button>
          <button onClick={() => navigate('/calendar')} style={styles.navButton}>Emploi du temps</button>
          <button onClick={() => navigate('/messages')} style={styles.navButton}>Messages</button>
        </div>
        <div style={styles.userMenu}>
          <span style={styles.userName}>👋 {user?.full_name || user?.username || user?.email}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            🔓 Déconnexion
          </button>
        </div>
      </nav>

      {/* Contenu principal */}
      <main style={styles.main}>
        <div style={styles.welcomeCard}>
          <h1>Bienvenue, {user?.full_name || user?.username || 'Étudiant'} !</h1>
          <p>Rôle : 👨‍🎓 Étudiant</p>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h3>📚 12</h3>
            <p>Cours disponibles</p>
          </div>
          <div style={styles.statCard}>
            <h3>📝 3</h3>
            <p>Devoirs à rendre</p>
          </div>
          <div style={styles.statCard}>
            <h3>💬 5</h3>
            <p>Messages non lus</p>
          </div>
          <div style={styles.statCard}>
            <h3>🎯 85%</h3>
            <p>Progression</p>
          </div>
        </div>

        <div style={styles.recentCourses}>
          <h2>📖 Cours récents</h2>
          <div style={styles.courseList}>
            <div style={styles.courseCard}>
              <h4>Architecture Microservices</h4>
              <p>Prof. M. Alaoui</p>
              <button onClick={() => navigate('/course/1')} style={styles.viewBtn}>
                Voir le cours →
              </button>
            </div>
            <div style={styles.courseCard}>
              <h4>Docker & Kubernetes</h4>
              <p>Prof. Mme Benali</p>
              <button onClick={() => navigate('/course/2')} style={styles.viewBtn}>
                Voir le cours →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// ========== STYLES ==========

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  navbar: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  navLinks: {
    display: 'flex',
    gap: '15px',
  },
  navButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  userName: {
    fontSize: '14px',
  },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  main: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  welcomeCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '25px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  recentCourses: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  courseList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  courseCard: {
    border: '1px solid #e0e0e0',
    padding: '15px',
    borderRadius: '8px',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  viewBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.3s',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
  },
};

// Ajout des effets hover
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  button:hover {
    opacity: 0.85;
  }
  .nav-button:hover {
    background-color: #34495e !important;
  }
  .logout-btn:hover {
    background-color: #c0392b !important;
  }
  .view-btn:hover {
    background-color: #2980b9 !important;
  }
  .course-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`;
document.head.appendChild(styleSheet);

export default Dashboard;