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
    logout();
  };

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Barre de navigation */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>ENT EST Salé</div>
        <div style={styles.navLinks}>
          <a href="/dashboard" style={styles.navLink}>Dashboard</a>
          <a href="/courses" style={styles.navLink}>Mes cours</a>
          <a href="/calendar" style={styles.navLink}>Emploi du temps</a>
          <a href="/messages" style={styles.navLink}>Messages</a>
        </div>
        <div style={styles.userMenu}>
          <span> {user.name}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Déconnexion
          </button>
        </div>
      </nav>

      {/* Contenu principal */}
      <main style={styles.main}>
        <div style={styles.welcomeCard}>
          <h1>Bienvenue, {user.name} !</h1>
          <p>Rôle : {user.role === 'etudiant' ? '👨‍🎓 Étudiant' : user.role === 'professeur' ? '👨‍🏫 Professeur' : '👑 Administrateur'}</p>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h3>12</h3>
            <p>Cours disponibles</p>
          </div>
          <div style={styles.statCard}>
            <h3>3</h3>
            <p>Devoirs à rendre</p>
          </div>
          <div style={styles.statCard}>
            <h3>5</h3>
            <p>Messages non lus</p>
          </div>
          <div style={styles.statCard}>
            <h3>85%</h3>
            <p>Progression</p>
          </div>
        </div>

        <div style={styles.recentCourses}>
          <h2>Cours récents</h2>
          <div style={styles.courseList}>
            {/* Ici on affichera les cours depuis l'API */}
            <div style={styles.courseCard}>
              <h4>Architecture Microservices</h4>
              <p>Prof. M. Alaoui</p>
              <button style={styles.viewBtn}>Voir le cours →</button>
            </div>
            <div style={styles.courseCard}>
              <h4>Docker & Kubernetes</h4>
              <p>Prof. Mme Benali</p>
              <button style={styles.viewBtn}>Voir le cours →</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

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
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '5px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
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
    border: '1px solid #ddd',
    padding: '15px',
    borderRadius: '8px',
  },
  viewBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default Dashboard;