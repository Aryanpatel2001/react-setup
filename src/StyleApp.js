"use client"

import { useEffect, useState, useMemo } from "react"
import axios from "axios"
import "./App.css"

const API_URL = "http://localhost:5000/api/todos"

export default function App() {
  const [todos, setTodos] = useState([])
  const [form, setForm] = useState({ product: "", price: "", item: "" })
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Search and Sort states
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name") // name, price, quantity, total
  const [sortOrder, setSortOrder] = useState("asc") // asc, desc

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const res = await axios.get(API_URL)
      setTodos(res.data)
    } catch (error) {
      setError("Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  // Auto-hide messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("")
        setSuccess("")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  // Filter and sort products
  const filteredAndSortedTodos = useMemo(() => {
    const filtered = todos.filter((todo) => todo.product.toLowerCase().includes(searchTerm.toLowerCase()))

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case "name":
          aValue = a.product.toLowerCase()
          bValue = b.product.toLowerCase()
          break
        case "price":
          aValue = a.price
          bValue = b.price
          break
        case "quantity":
          aValue = a.item
          bValue = b.item
          break
        case "total":
          aValue = a.price * a.item
          bValue = b.price * b.item
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [todos, searchTerm, sortBy, sortOrder])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validation
    if (!form.product || form.product.trim().length < 3) {
      setError("Product name must be at least 3 characters long.")
      return
    }

    const price = Number.parseFloat(form.price)
    const item = Number.parseInt(form.item)

    if (isNaN(price) || price <= 0) {
      setError("Price must be a positive number.")
      return
    }

    if (isNaN(item) || item < 1) {
      setError("Item count must be at least 1.")
      return
    }

    const payload = {
      product: form.product.trim(),
      price,
      item,
    }

    try {
      setLoading(true)
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, payload)
        setEditId(null)
        setSuccess("Product updated successfully!")
      } else {
        await axios.post(API_URL, payload)
        setSuccess("Product added successfully!")
      }

      setForm({ product: "", price: "", item: "" })
      fetchTodos()
    } catch (error) {
      console.error("Error submitting form:", error.message)
      setError("Failed to save product. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (todo) => {
    setForm({
      product: todo.product,
      price: todo.price.toString(),
      item: todo.item.toString(),
    })
    setEditId(todo._id)
    setError("")
    setSuccess("")
  }

  const handleCancel = () => {
    setForm({ product: "", price: "", item: "" })
    setEditId(null)
    setError("")
    setSuccess("")
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setLoading(true)
        await axios.delete(`${API_URL}/${id}`)
        fetchTodos()
        setSuccess("Product deleted successfully!")
      } catch (error) {
        setError("Failed to delete product")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const clearSearch = () => {
    setSearchTerm("")
  }

  const total = filteredAndSortedTodos.reduce((sum, t) => sum + t.price * t.item, 0)
  const totalAllProducts = todos.reduce((sum, t) => sum + t.price * t.item, 0)

  const getSortIcon = (field) => {
    if (sortBy !== field) return "↕️"
    return sortOrder === "asc" ? "⬆️" : "⬇️"
  }

  return (
    <div className="app-container">
      <div className="app-content">
        {/* Header */}
        <div className="header">
          <h1>🛍️ Product Management System</h1>
          <p>Manage your inventory with ease</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="message success-message">
            <span>✅</span> {success}
          </div>
        )}

        {error && (
          <div className="message error-message">
            <span>❌</span> {error}
          </div>
        )}

        {/* Form Card */}
        <div className="form-card">
          <div className="form-header">
            <h2>{editId ? "✏️ Edit Product" : "➕ Add New Product"}</h2>
            <p>{editId ? "Update product information" : "Fill in the details below"}</p>
          </div>

          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-grid">
              <div className="form-group">
                <label>📦 Product Name</label>
                <input
                  name="product"
                  placeholder="Enter product name"
                  value={form.product}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>💰 Price (₹)</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={form.price}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>🔢 Quantity</label>
                <input
                  name="item"
                  type="number"
                  placeholder="1"
                  value={form.item}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading && <div className="spinner"></div>}
                {editId ? "Update Product" : "Add Product"}
              </button>

              {editId && (
                <button type="button" onClick={handleCancel} className="btn btn-secondary" disabled={loading}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search and Filter Controls */}
        <div className="search-filter-card">
          <div className="search-filter-content">
            {/* Search Bar */}
            <div className="search-section">
              <label>🔍 Search Products</label>
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search by product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <button onClick={clearSearch} className="clear-search-btn" title="Clear search">
                    ❌
                  </button>
                )}
              </div>
            </div>

            {/* Sort Controls */}
            <div className="sort-controls">
              <div className="sort-group">
                <label>📊 Sort By</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                  <option value="name">Product Name</option>
                  <option value="price">Price</option>
                  <option value="quantity">Quantity</option>
                  <option value="total">Total Value</option>
                </select>
              </div>

              <div className="sort-group">
                <label>📈 Order</label>
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="sort-select">
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search Results Info */}
          {searchTerm && (
            <div className="search-results-info">
              <p>
                <strong>{filteredAndSortedTodos.length}</strong> product(s) found for "{searchTerm}"
                {filteredAndSortedTodos.length !== todos.length && (
                  <span className="total-count"> (out of {todos.length} total)</span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Products Table Card */}
        <div className="table-card">
          <div className="table-header">
            <div>
              <h2>📊 Product Inventory</h2>
              <p>
                Showing {filteredAndSortedTodos.length} of {todos.length} products
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>
            <div className="totals-section">
              {searchTerm && (
                <div className="total-badge filtered-total">
                  <span className="total-amount">₹{total.toFixed(2)}</span>
                  <p>Filtered Total</p>
                </div>
              )}
              <div className="total-badge">
                <span className="total-amount">₹{totalAllProducts.toFixed(2)}</span>
                <p>Total Value</p>
              </div>
            </div>
          </div>

          <div className="table-content">
            {filteredAndSortedTodos.length === 0 ? (
              <div className="empty-state">
                {searchTerm ? (
                  <>
                    <div className="empty-icon">🔍</div>
                    <h3>No products found</h3>
                    <p>No products match your search for "{searchTerm}"</p>
                    <button onClick={clearSearch} className="btn btn-primary clear-search-button">
                      Clear Search
                    </button>
                  </>
                ) : (
                  <>
                    <div className="empty-icon">📦</div>
                    <h3>No Products Yet</h3>
                    <p>Add your first product to get started!</p>
                  </>
                )}
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th
                        className="sortable-header"
                        onClick={() => handleSort("name")}
                        title="Click to sort by product name"
                      >
                        <div className="header-content">Product {getSortIcon("name")}</div>
                      </th>
                      <th
                        className="sortable-header price-header"
                        onClick={() => handleSort("price")}
                        title="Click to sort by price"
                      >
                        <div className="header-content">Price {getSortIcon("price")}</div>
                      </th>
                      <th
                        className="sortable-header qty-header"
                        onClick={() => handleSort("quantity")}
                        title="Click to sort by quantity"
                      >
                        <div className="header-content">Qty {getSortIcon("quantity")}</div>
                      </th>
                      <th
                        className="sortable-header total-header"
                        onClick={() => handleSort("total")}
                        title="Click to sort by total value"
                      >
                        <div className="header-content">Total {getSortIcon("total")}</div>
                      </th>
                      <th className="actions-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedTodos.map((todo, i) => (
                      <tr key={todo._id}>
                        <td>{i + 1}</td>
                        <td className="product-name">
                          {searchTerm ? (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: todo.product.replace(
                                  new RegExp(`(${searchTerm})`, "gi"),
                                  '<mark class="search-highlight">$1</mark>',
                                ),
                              }}
                            />
                          ) : (
                            todo.product
                          )}
                        </td>
                        <td className="price">₹{todo.price.toFixed(2)}</td>
                        <td className="quantity">{todo.item}</td>
                        <td className="total-price">₹{(todo.price * todo.item).toFixed(2)}</td>
                        <td>
                          <div className="action-buttons">
                            <button onClick={() => handleEdit(todo)} disabled={loading} className="btn btn-edit">
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDelete(todo._id)}
                              disabled={loading}
                              className="btn btn-delete"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
