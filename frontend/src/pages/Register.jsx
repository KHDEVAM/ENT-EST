import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);

    try {
      await register({
        username,
        password,
        email,
        full_name: fullName
      });

      alert("Compte créé avec succès !");
      navigate("/login");
    } catch (err) {
      setError(err.detail || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.whiteBackground}>
        <div style={styles.yellowFrame}>

          <div style={styles.logoContainer}>
            <img 
              src={`${process.env.PUBLIC_URL}/images/est.png`}
              alt="Logo"
              style={styles.logoImage}
            />
          </div>

          <div style={styles.loginBox}>
            <div style={styles.loginHeader}>
              <h3 style={styles.authTitle}>INSCRIPTION</h3>
              <a href="/login" style={styles.helpLink}>RETOUR</a>
            </div>

            {error && <div style={styles.errorMessage}>❌ {error}</div>}

            <form onSubmit={handleSubmit}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Nom complet:</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={styles.input}
                  placeholder="Votre nom et prénom"
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  placeholder="exemple@est-sale.ma"
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Nom d'utilisateur:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={styles.input}
                  placeholder="Votre pseudo"
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Mot de passe:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  placeholder="Au moins 6 caractères"
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Confirmer mot de passe:</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={styles.input}
                  placeholder="Retapez votre mot de passe"
                  required
                />
              </div>

              <button 
                type="submit" 
                style={styles.loginButton}
                disabled={loading}
              >
                {loading ? "INSCRIPTION..." : "S'INSCRIRE"}
              </button>

              <div style={styles.footer}>
                <p>
                  Déjà un compte ? <a href="/login" style={styles.registerLink}>Connectez-vous</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  logoContainer: {
    textAlign: 'center',
    marginBottom: '25px',
    paddingBottom: '15px',
    borderBottom: '1px solid #f9a825',
  },
  logoImage: {
    maxWidth: '100%',
    height: 'auto',
    maxHeight: '100px',
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
  },
  loginButton: {
    width: 'calc(100% - 30px)',
    margin: '20px 15px 15px 15px',
    padding: '10px',
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  footer: {
    textAlign: 'center',
    padding: '0 15px 20px 15px',
  },
  registerLink: {
    color: '#2980b9',
    textDecoration: 'none',
    fontWeight: 'bold',
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

export default Register;