import { useState, useEffect } from "react";
import api from "../api/api";

export default function AdminSweetForm({ selectedSweet, onSuccess }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (selectedSweet) {
      setName(selectedSweet.name);
      setCategory(selectedSweet.category);
      setPrice(selectedSweet.price);
      setQuantity(selectedSweet.quantity);
    } else {
      clearForm();
    }
  }, [selectedSweet]);

  const clearForm = () => {
    setName("");
    setCategory("");
    setPrice("");
    setQuantity("");
  };

  const handleSubmit = async () => {
    const payload = {
      name,
      category,
      price: Number(price),
      quantity: Number(quantity),
    };

    if (selectedSweet) {
      // UPDATE
      await api.put(`/api/sweets/${selectedSweet.id}`, payload);
    } else {
      // ADD
      await api.post("/api/sweets", payload);
    }

    clearForm();
    onSuccess();
  };

  return (
    <div style={{ border: "1px solid #aaa", padding: "15px", marginBottom: "20px" }}>
      <h3>{selectedSweet ? "Update Sweet" : "Add Sweet"}</h3>

      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <br />

      <input
        placeholder="Category"
        value={category}
        onChange={e => setCategory(e.target.value)}
      />
      <br />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={e => setPrice(e.target.value)}
      />
      <br />

      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={e => setQuantity(e.target.value)}
      />
      <br />

      <button onClick={handleSubmit}>
        {selectedSweet ? "Update" : "Add"}
      </button>

      {selectedSweet && (
        <button onClick={clearForm} style={{ marginLeft: "10px" }}>
          Cancel
        </button>
      )}
    </div>
  );
}
