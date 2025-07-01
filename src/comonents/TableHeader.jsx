export default function TableHeader({ filteredCount, totalCount, searchTerm, filteredTotal, totalAllProducts }) {
    return (
      <div className="table-header">
        <div>
          <h2>📊 Product Inventory</h2>
          <p>
            Showing {filteredCount} of {totalCount} products
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>
        <div className="totals-section">
          {searchTerm && (
            <div className="total-badge filtered-total">
              <span className="total-amount">₹{filteredTotal.toLocaleString('en-IN')}</span>
              <p>Filtered Total</p>
            </div>
          )}
          <div className="total-badge">
            <span className="total-amount">₹{totalAllProducts.toLocaleString('en-IN')}</span>
            <p>Total Value</p>
          </div>
        </div>
      </div>
    )
  }
  