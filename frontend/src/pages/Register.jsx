import { useState } from "react";
import api from "../api/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async () => {
    await api.post("/api/auth/register", { username, password });
    setMsg("Registered successfully. Please login.");
  };

  return (
    <div>
      <h2>Register</h2>
      {msg && <p>{msg}</p>}
      <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
