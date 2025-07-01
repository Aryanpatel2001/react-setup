"use client"

export default function EmptyState({ searchTerm, onClearSearch }) {
  return (
    <div className="empty-state">
      {searchTerm ? (
        <>
          <div className="empty-icon">🔍</div>
          <h3>No products found</h3>
          <p>No products match your search for "{searchTerm}"</p>
          <button onClick={onClearSearch} className="btn btn-primary clear-search-button">
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
  )
}
