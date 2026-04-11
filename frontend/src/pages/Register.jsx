import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await register({
        username,
        password,
      });

      alert("Compte créé avec succès !");
      navigate("/login");
    } catch (err) {
      setError(err.detail || "Erreur inscription");
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
            </div>

            {error && <div style={styles.errorMessage}>❌ {error}</div>}

            <form onSubmit={handleSubmit}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Username:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={styles.input}
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
                  required
                />
              </div>

              <button type="submit" style={styles.loginButton}>
                REGISTER
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = { /* garde tes styles */ };

export default Register;