import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getCurrentUser } from "../services/api";

const Layout = () => {
  const user = getCurrentUser();

  return (
    <div style={styles.container}>
      <Navbar user={user} />

      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  main: {
    padding: "30px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
};

export default Layout;