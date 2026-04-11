import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.detail || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Fond blanc */}
      <div style={styles.whiteBackground}>
        
        {/* Cadre jaune principal */}
        <div style={styles.yellowFrame}>
          
          {/* ⭐ TON IMAGE ICI (à la place du texte) ⭐ */}
          <div style={styles.logoContainer}>
            <img 
              src={`${process.env.PUBLIC_URL}/images/est.png`}
              alt="EST Salé Logo"
              style={styles.logoImage}
            />
          </div>

          {/* Boîte de connexion */}
          <div style={styles.loginBox}>
            <div style={styles.loginHeader}>
              <h3 style={styles.authTitle}>AUTHENTIFICATION</h3>
              <a href="/help" style={styles.helpLink}>BESOIN D'AIDE ?</a>
            </div>

            <div style={styles.newUserBox}>
              <p style={styles.newUserText}>
                Nouveau à l'université ? <a href="/register" style={styles.registerLink}>Validez votre compte</a>
              </p>
            </div>

            {error && (
              <div style={styles.errorMessage}>
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Username:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={styles.input}
                  placeholder="Votre nom d'utilisateur"
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  placeholder="Votre mot de passe"
                  required
                />
              </div>

              <button 
                type="submit" 
                style={styles.loginButton}
                disabled={loading}
              >
                {loading ? 'CONNEXION...' : 'LOGIN'}
              </button>

              <div style={styles.forgotPassword}>
                <a href="/forgot-password" style={styles.forgotLink}>
                  Forgot your password?
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== STYLES ==========

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
  },
  
  whiteBackground: {
    backgroundColor: 'white',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  
  yellowFrame: {
    backgroundColor: '#fffde7',
    border: '2px solid #f9a825',
    borderRadius: '12px',
    maxWidth: '500px',
    width: '100%',
    padding: '30px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  
  // ⭐ STYLES POUR L'IMAGE ⭐
  logoContainer: {
    textAlign: 'center',
    marginBottom: '25px',
    paddingBottom: '15px',
    borderBottom: '1px solid #f9a825',
  },
  logoImage: {
    maxWidth: '100%',
    height: 'auto',
    maxHeight: '100px',  // Ajuste selon la taille de ton image
    objectFit: 'contain',
  },
  
  loginBox: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  loginHeader: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '12px 15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    margin: 0,
  },
  helpLink: {
    color: '#f9a825',
    textDecoration: 'none',
    fontSize: '11px',
    fontWeight: 'bold',
  },
  newUserBox: {
    backgroundColor: '#e8f4f8',
    padding: '10px 15px',
    borderBottom: '1px solid #eee',
  },
  newUserText: {
    margin: 0,
    fontSize: '12px',
    color: '#333',
  },
  registerLink: {
    color: '#2980b9',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  errorMessage: {
    backgroundColor: '#fee',
    color: '#c00',
    padding: '8px 15px',
    margin: '15px',
    borderRadius: '5px',
    fontSize: '12px',
    textAlign: 'center',
  },
  inputGroup: {
    padding: '12px 15px 0 15px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '13px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  loginButton: {
    width: 'calc(100% - 30px)',
    margin: '15px',
    padding: '10px',
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  forgotPassword: {
    textAlign: 'center',
    padding: '0 15px 15px 15px',
  },
  forgotLink: {
    color: '#7f8c8d',
    textDecoration: 'none',
    fontSize: '11px',
  },
};

// Styles pour les effets hover
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  input:focus {
    border-color: #f9a825 !important;
    box-shadow: 0 0 3px rgba(249, 168, 37, 0.3);
  }
  button:hover {
    background-color: #1a252f !important;
  }
  a:hover {
    text-decoration: underline !important;
  }
`;
document.head.appendChild(styleSheet);

export default Login;