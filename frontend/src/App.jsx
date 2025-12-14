import { useEffect, useState } from "react";
import api from "./api/api";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminSweetForm from "./components/AdminSweetForm";
import { jwtDecode } from "jwt-decode";

export default function App() {
  const [sweets, setSweets] = useState([]);
  const [query, setQuery] = useState("");
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  const [showRegister, setShowRegister] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // ✅ ADD THIS

  // 🔐 Decode token & detect admin
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAdmin(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log("JWT decoded:", decoded); // debug
      setIsAdmin(decoded.is_admin === true);
    } catch (err) {
      console.error("JWT decode failed", err);
      setIsAdmin(false);
    }
  }, [loggedIn]);

  // fetch sweets
  const fetchSweets = () => {
    api.get("/api/sweets")
      .then(res => setSweets(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  // purchase sweet
  const purchaseSweet = async (id) => {
    await api.post(`/api/sweets/${id}/purchase`);
    setSweets(prev =>
      prev.map(s =>
        s.id === id ? { ...s, quantity: s.quantity - 1 } : s
      )
    );
  };

  // delete sweet (admin only – backend enforces)
  const deleteSweet = async (id) => {
    await api.delete(`/api/sweets/${id}`);
    setSweets(prev => prev.filter(s => s.id !== id));
  };

  // logout
  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setIsAdmin(false);
  };

  // NOT LOGGED IN → auth screens
  if (!loggedIn) {
    return (
      <div style={{ padding: "20px" }}>
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

  // LOGGED IN → dashboard
  return (
    <div style={{ padding: "20px" }}>
      <h1>🍬 Sweet Shop</h1>

      <button onClick={logout} style={{ float: "right" }}>
        Logout
      </button>

      {/* 🔒 ADMIN ADD / UPDATE FORM */}
      {isAdmin && (
        <AdminSweetForm
          selectedSweet={selectedSweet}
          onSuccess={() => {
            setSelectedSweet(null);
            fetchSweets();
          }}
        />
      )}

      {/* Search */}
      <input
        placeholder="Search sweets by name or category"
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ marginBottom: "20px", width: "100%" }}
      />

      {sweets.length === 0 && <p>No sweets available</p>}

      {sweets
        .filter(s =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.category.toLowerCase().includes(query.toLowerCase())
        )
        .map(sweet => (
          <div
            key={sweet.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{sweet.name}</h3>
            <p>Category: {sweet.category}</p>
            <p>Price: ₹{sweet.price}</p>
            <p>Stock: {sweet.quantity}</p>

            <button
              disabled={sweet.quantity === 0}
              onClick={() => purchaseSweet(sweet.id)}
            >
              Purchase
            </button>

            {/* 🔒 ADMIN CONTROLS */}
            {isAdmin && (
              <>
                <button
                  onClick={() => setSelectedSweet(sweet)}
                  style={{ marginLeft: "10px" }}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteSweet(sweet.id)}
                  style={{ marginLeft: "10px", color: "red" }}
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
