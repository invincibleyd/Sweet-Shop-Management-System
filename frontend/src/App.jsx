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
    background: "linear-gradient(135deg, #fff7ed, #fde68a)",
    padding: "30px",
    fontFamily: "Segoe UI, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },
  card: {
    background: "#fff",
    borderRadius: "14px",
    padding: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    marginBottom: "16px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    marginBottom: "20px",
    fontSize: "15px",
  },
  btnPrimary: {
    background: "#f59e0b",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
  btnSecondary: {
    background: "#e5e7eb",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    marginLeft: "8px",
    cursor: "pointer",
  },
  btnDanger: {
    background: "#ef4444",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    marginLeft: "8px",
    color: "#fff",
    cursor: "pointer",
  },
  badgeAdmin: {
    background: "#22c55e",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    marginRight: "10px",
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
      <div style={styles.header}>
        <h1>🍬 Sweet Shop</h1>
        <div>
          {isAdmin && <span style={styles.badgeAdmin}>ADMIN</span>}
          <button onClick={logout} style={styles.btnSecondary}>
            Logout
          </button>
        </div>
      </div>

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

      <input
        placeholder="Search sweets by name or category..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={styles.input}
      />

      {sweets.length === 0 && <p>No sweets available 🍭</p>}

      {sweets
        .filter(s =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.category.toLowerCase().includes(query.toLowerCase())
        )
        .map(sweet => (
          <div key={sweet.id} style={styles.card}>
            <h3>{sweet.name}</h3>
            <p><b>Category:</b> {sweet.category}</p>
            <p><b>Price:</b> ₹{sweet.price}</p>
            <p>
              <b>Stock:</b>{" "}
              <span style={{ color: sweet.quantity === 0 ? "#ef4444" : "#16a34a" }}>
                {sweet.quantity}
              </span>
            </p>

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
        ))}
    </div>
  );
}
