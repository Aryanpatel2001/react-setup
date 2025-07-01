"use client"

export default function ProductRow({ product, index, searchTerm, loading, onEdit, onDelete }) {
  const highlightSearchTerm = (text, term) => {
    if (!term) return text

    return (
      <span
        dangerouslySetInnerHTML={{
          __html: text.replace(new RegExp(`(${term})`, "gi"), '<mark class="search-highlight">$1</mark>'),
        }}
      />
    )
  }

  return (
    <tr>
      <td>{index}</td>
      <td className="product-name">{highlightSearchTerm(product.product, searchTerm)}</td>
      <td className="price">₹{product.price.toFixed(2)}</td>
      <td className="quantity">{product.item}</td>
      <td className="total-price">₹{(product.price * product.item).toLocaleString('en-IN')}</td>
      <td>
        <div className="action-buttons">
          <button onClick={() => onEdit(product)} disabled={loading} className="btn btn-edit">
            ✏️ Edit
          </button>
          <button onClick={() => onDelete(product._id)} disabled={loading} className="btn btn-delete">
            🗑️ Delete
          </button>
        </div>
      </td>
    </tr>
  )
}
