import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/todos";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({ product: "", price: "", item: "" });
  const [editId, setEditId] = useState(null);

  const fetchTodos = async () => {
    const res = await axios.get(API_URL);
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validation
    if (!form.product || form.product.trim().length < 3) {
      alert("Product name must be at least 3 characters long.");
      return;
    }
  
    const price = parseFloat(form.price);
    const item = parseInt(form.item);
  
    if (isNaN(price) || price <= 0) {
      alert("Price must be a positive number.");
      return;
    }
  
    if (isNaN(item) || item < 1) {
      alert("Item count must be at least 1.");
      return;
    }
  
    const payload = {
      product: form.product.trim(),
      price,
      item,
    };
  
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, payload);
        setEditId(null);
      } else {
        await axios.post(API_URL, payload);
      }
  
      setForm({ product: "", price: "", item: "" });
      fetchTodos();
    } catch (error) {
      console.error("Error submitting form:", error.message);
      alert("Failed to save todo. Try again.");
    }
  };
  

  const handleEdit = (todo) => {
    setForm(todo);
    setEditId(todo._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTodos();
  };

  const total = todos.reduce((sum, t) => sum + t.price * t.item, 0);

  return (
    <div style={{ padding: 20 }}>
      <h2>MongoDB Product Todo App</h2>
      <form onSubmit={handleSubmit}>
        <input name="product" placeholder="Product" value={form.product} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="item" type="number" placeholder="Item" value={form.item} onChange={handleChange} required />
        <button type="submit">{editId ? "Update" : "Add"}</button>
      </form>

      <table border="1" style={{ marginTop: 20, width: "100%" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Price</th>
            <th>Item</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo, i) => (
            <tr key={todo._id}>
              <td>{i + 1}</td>
              <td>{todo.product}</td>
              <td>₹{todo.price}</td>
              <td>{todo.item}</td>
              <td>₹{todo.price * todo.item}</td>
              <td>
                <button onClick={() => handleEdit(todo)}>Edit</button>
                <button onClick={() => handleDelete(todo._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: 10 }}>Total Price: ₹{total}</h3>
    </div>
  );
}
