import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout, getCourses } from '../services/api';

const CourseList = () => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    loadCourses();
  }, [navigate]);

  const loadCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (error) {
      console.error('Erreur chargement cours:', error);
      // Données fictives pour tester
      setCourses([
        { id: 1, title: 'Architecture Microservices', teacher: 'Prof. Alaoui', description: 'Découvrez les bases des microservices' },
        { id: 2, title: 'Docker & Kubernetes', teacher: 'Prof. Benali', description: 'Conteneurisation et orchestration' },
        { id: 3, title: 'Programmation Web avec React', teacher: 'Prof. Chraibi', description: 'Développement frontend moderne' },
        { id: 4, title: 'Bases de données NoSQL', teacher: 'Prof. Toumi', description: 'Introduction à Cassandra' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return <div style={styles.loading}>Chargement des cours...</div>;
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
          <span>👋 {user?.full_name || user?.username}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Déconnexion</button>
        </div>
      </nav>

      {/* Contenu principal */}
      <main style={styles.main}>
        <div style={styles.header}>
          <h1>📚 Mes cours</h1>
          <p>Voici la liste de vos cours disponibles</p>
        </div>

        <div style={styles.courseGrid}>
          {courses.map((course) => (
            <div key={course.id} style={styles.courseCard}>
              <div style={styles.courseIcon}>📖</div>
              <h3 style={styles.courseTitle}>{course.title}</h3>
              <p style={styles.courseTeacher}>{course.teacher}</p>
              <p style={styles.courseDescription}>{course.description}</p>
              <button 
                onClick={() => navigate(`/course/${course.id}`)} 
                style={styles.viewBtn}
              >
                Voir le cours →
              </button>
            </div>
          ))}
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
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  main: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '30px',
  },
  courseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '25px',
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  courseIcon: {
    fontSize: '40px',
    marginBottom: '10px',
  },
  courseTitle: {
    fontSize: '18px',
    marginBottom: '8px',
    color: '#2c3e50',
  },
  courseTeacher: {
    fontSize: '14px',
    color: '#7f8c8d',
    marginBottom: '10px',
  },
  courseDescription: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '15px',
    lineHeight: '1.4',
  },
  viewBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '14px',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
  },
};

export default CourseList;