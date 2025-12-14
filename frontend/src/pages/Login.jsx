import { useState } from "react";
import api from "../api/api";

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    padding: "16px",
  },
  card: {
    width: "100%",
    maxWidth: "380px",
    background: "#ffffff",
    borderRadius: "14px",
    padding: "24px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
    color: "#0f172a",
  },
  title: {
    marginBottom: "16px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "14px",
    borderRadius: "8px",
    border: "1px solid #cbd5f5",
    fontSize: "15px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px",
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "14px",
    fontSize: "14px",
    textAlign: "center",
  },
};

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      const form = new FormData();
      form.append("username", username);
      form.append("password", password);

      const res = await api.post("/api/auth/login", form);
      localStorage.setItem("token", res.data.access_token);
      onLogin();
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Login</h2>

        {error && <div style={styles.error}>{error}</div>}

        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}
