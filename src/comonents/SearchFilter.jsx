"use client"

export default function SearchFilter({
  searchTerm,
  sortBy,
  sortOrder,
  onSearchChange,
  onSortByChange,
  onSortOrderChange,
  onClearSearch,
  filteredCount,
  totalCount,
}) {
  return (
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
              onChange={onSearchChange}
              className="search-input"
            />
            {searchTerm && (
              <button onClick={onClearSearch} className="clear-search-btn" title="Clear search">
                ❌
              </button>
            )}
          </div>
        </div>

        {/* Sort Controls */}
        <div className="sort-controls">
          <div className="sort-group">
            <label>📊 Sort By</label>
            <select value={sortBy} onChange={onSortByChange} className="sort-select">
              <option value="name">Product Name</option>
              <option value="price">Price</option>
              <option value="quantity">Quantity</option>
              <option value="total">Total Value</option>
            </select>
          </div>

          <div className="sort-group">
            <label>📈 Order</label>
            <select value={sortOrder} onChange={onSortOrderChange} className="sort-select">
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
            <strong>{filteredCount}</strong> product(s) found for "{searchTerm}"
            {filteredCount !== totalCount && <span className="total-count"> (out of {totalCount} total)</span>}
          </p>
        </div>
      )}
    </div>
  )
}
