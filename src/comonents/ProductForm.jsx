"use client"

export default function ProductForm({ form, editId, loading, onSubmit, onChange, onCancel }) {
  return (
    <div className="form-card">
      <div className="form-header">
        <h2>{editId ? "✏️ Edit Product" : "➕ Add New Product"}</h2>
        <p>{editId ? "Update product information" : "Fill in the details below"}</p>
      </div>

      <form onSubmit={onSubmit} className="product-form">
        <div className="form-grid">
          <div className="form-group">
            <label>📦 Product Name</label>
            <input
              name="product"
              placeholder="Enter product name"
              value={form.product}
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
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
            <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={loading}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
