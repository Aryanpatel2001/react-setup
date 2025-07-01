"use client"

import EmptyState from "./EmptyState"
import TableHeader from "./TableHeader"
import ProductRow from "./ProductRow"

export default function ProductTable({
  products,
  searchTerm,
  totalCount,
  filteredTotal,
  totalAllProducts,
  loading,
  onEdit,
  onDelete,
  onSort,
  sortBy,
  sortOrder,
  onClearSearch,
}) {
  const getSortIcon = (field) => {
    if (sortBy !== field) return "↕️"
    return sortOrder === "asc" ? "⬆️" : "⬇️"
  }

  return (
    <div className="table-card">
      <TableHeader
        filteredCount={products.length}
        totalCount={totalCount}
        searchTerm={searchTerm}
        filteredTotal={filteredTotal}
        totalAllProducts={totalAllProducts}
      />

      <div className="table-content">
        {products.length === 0 ? (
          <EmptyState searchTerm={searchTerm} onClearSearch={onClearSearch} />
        ) : (
          <div className="table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th className="sortable-header" onClick={() => onSort("name")} title="Click to sort by product name">
                    <div className="header-content">Product {getSortIcon("name")}</div>
                  </th>
                  <th
                    className="sortable-header price-header"
                    onClick={() => onSort("price")}
                    title="Click to sort by price"
                  >
                    <div className="header-content">Price {getSortIcon("price")}</div>
                  </th>
                  <th
                    className="sortable-header qty-header"
                    onClick={() => onSort("quantity")}
                    title="Click to sort by quantity"
                  >
                    <div className="header-content">Qty {getSortIcon("quantity")}</div>
                  </th>
                  <th
                    className="sortable-header total-header"
                    onClick={() => onSort("total")}
                    title="Click to sort by total value"
                  >
                    <div className="header-content">Total {getSortIcon("total")}</div>
                  </th>
                  <th className="actions-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, i) => (
                  <ProductRow
                    key={product._id}
                    product={product}
                    index={i + 1}
                    searchTerm={searchTerm}
                    loading={loading}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
