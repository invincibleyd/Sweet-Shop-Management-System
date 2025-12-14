import { useState } from "react";
import api from "../api/api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const form = new FormData();
      form.append("username", username);
      form.append("password", password);

      const res = await api.post("/api/auth/login", form);
      localStorage.setItem("token", res.data.access_token);
      onLogin();
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
