import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/api";

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>🎓 ENT EST Salé</div>

      <div style={styles.navLinks}>
        <button onClick={() => navigate("/dashboard")} style={styles.navButton}>
          Dashboard
        </button>
        <button onClick={() => navigate("/courses")} style={styles.navButton}>
          Mes cours
        </button>
        <button onClick={() => navigate("/calendar")} style={styles.navButton}>
          Emploi du temps
        </button>
        <button onClick={() => navigate("/messages")} style={styles.navButton}>
          Messages
        </button>
      </div>

      <div style={styles.userMenu}>
        <span style={styles.userName}>
          👋 {user?.full_name || user?.username || user?.email}
        </span>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          🔓 Déconnexion
        </button>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: "#2c3e50",
    color: "white",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  navLinks: {
    display: "flex",
    gap: "15px",
  },
  navButton: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "14px",
    cursor: "pointer",
    padding: "8px 12px",
    borderRadius: "5px",
  },
  userMenu: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  userName: {
    fontSize: "14px",
  },
  logoutBtn: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Navbar;