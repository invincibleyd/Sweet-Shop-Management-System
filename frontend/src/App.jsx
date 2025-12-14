import { useEffect, useState } from "react";
import api from "./api/api";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminSweetForm from "./components/AdminSweetForm";
import { jwtDecode } from "jwt-decode";

/* 🎨 UI Styles */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    padding: "20px", // smaller for mobile
    fontFamily: "Inter, Segoe UI, sans-serif",
    color: "#f8fafc",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    flexWrap: "wrap",   // ✅ important
    gap: "15px",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },
  grid: {
    display: "grid",
    gap: "20px", // 👈 THIS adds space between cards
  },  
  card: {
    background: "#ffffff",
    color: "#0f172a",
    borderRadius: "15px",
    padding: "15px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #cbd5f5",
    marginBottom: "20px",
    fontSize: "15px",
    background: "#f8fafc",
  },
  btnPrimary: {
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
  btnSecondary: {
    background: "#e5e7eb",
    color: "#0f172a",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    marginLeft: "8px",
    cursor: "pointer",
  },
  btnDanger: {
    background: "#dc2626",
    color: "#ffffff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    marginLeft: "8px",
    cursor: "pointer",
  },
  badgeAdmin: {
    background: "#16a34a",
    color: "#ffffff",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    marginRight: "10px",
  },
  muted: {
    color: "#475569",
    fontSize: "14px",
  }
};


export default function App() {
  const [sweets, setSweets] = useState([]);
  const [query, setQuery] = useState("");
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  const [showRegister, setShowRegister] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  /* 🔐 Decode JWT */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setIsAdmin(false);

    try {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.is_admin === true);
    } catch {
      setIsAdmin(false);
    }
  }, [loggedIn]);

  const fetchSweets = () => {
    api.get("/api/sweets")
      .then(res => setSweets(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const purchaseSweet = async (id) => {
    await api.post(`/api/sweets/${id}/purchase`);
    setSweets(prev =>
      prev.map(s =>
        s.id === id ? { ...s, quantity: s.quantity - 1 } : s
      )
    );
  };

  const deleteSweet = async (id) => {
    await api.delete(`/api/sweets/${id}`);
    setSweets(prev => prev.filter(s => s.id !== id));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setIsAdmin(false);
  };

  /* 🔐 AUTH SCREENS */
  if (!loggedIn) {
    return (
      <div style={styles.page}>
        <h1>🍬 Sweet Shop</h1>
        {showRegister ? (
          <>
            <Register />
            <p>
              Already have an account?{" "}
              <button onClick={() => setShowRegister(false)}>Login</button>
            </p>
          </>
        ) : (
          <>
            <Login onLogin={() => setLoggedIn(true)} />
            <p>
              New user?{" "}
              <button onClick={() => setShowRegister(true)}>Register</button>
            </p>
          </>
        )}
      </div>
    );
  }

  /* 🏠 DASHBOARD */
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <h1>🍬 Sweet Shop</h1>
  
          <div>
            {isAdmin && <span style={styles.badgeAdmin}>ADMIN</span>}
            <button onClick={logout} style={styles.btnSecondary}>
              Logout
            </button>
          </div>
        </div>
  
        {/* ADMIN FORM */}
        {isAdmin && (
          <div style={styles.card}>
            <AdminSweetForm
              selectedSweet={selectedSweet}
              onSuccess={() => {
                setSelectedSweet(null);
                fetchSweets();
              }}
            />
          </div>
        )}
  
        {/* SEARCH */}
        <input
          placeholder="Search sweets by name or category..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={styles.input}
        />
  
        {/* SWEETS GRID */}
        <div style={styles.grid}>
          {sweets
            .filter(s =>
              s.name.toLowerCase().includes(query.toLowerCase()) ||
              s.category.toLowerCase().includes(query.toLowerCase())
            )
            .map(sweet => (
              <div key={sweet.id} style={styles.card}>
                <h3>{sweet.name}</h3>
                <p style={styles.muted}>Category: {sweet.category}</p>
                <p><b>Price:</b> ₹{sweet.price}</p>
                <p>
                  <b>Stock:</b>{" "}
                  <span style={{ color: sweet.quantity === 0 ? "#dc2626" : "#16a34a" }}>
                    {sweet.quantity}
                  </span>
                </p>
  
                {/* BUTTONS */}
                <div style={styles.buttonRow}>
                  <button
                    disabled={sweet.quantity === 0}
                    onClick={() => purchaseSweet(sweet.id)}
                    style={{
                      ...styles.btnPrimary,
                      opacity: sweet.quantity === 0 ? 0.5 : 1
                    }}
                  >
                    Purchase
                  </button>
  
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => setSelectedSweet(sweet)}
                        style={styles.btnSecondary}
                      >
                        Edit
                      </button>
  
                      <button
                        onClick={() => deleteSweet(sweet.id)}
                        style={styles.btnDanger}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
  
}
