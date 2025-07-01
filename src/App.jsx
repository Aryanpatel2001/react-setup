"use client"

import { useEffect } from "react"

import "./App.css"
import { useProducts } from "./hooks/useProducts"
import { useForm } from "./hooks/useForm"
import Header from "./comonents/Header"
import Message from "./comonents/Message"
import ProductForm from "./comonents/ProductForm"
import SearchFilter from "./comonents/SearchFilter"
import ProductTable from "./comonents/ProductTable"
import { useSearch } from "./hooks/useSearch"

const API_URL = "http://localhost:5000/api/todos"

export default function App() {
  const { todos, loading, error, success, addProduct, updateProduct, deleteProduct, setError, setSuccess } =
    useProducts()
  const {
    searchTerm,
    sortBy,
    sortOrder,
    filteredAndSortedTodos,
    setSearchTerm,
    setSortBy,
    setSortOrder,
    handleSort,
    clearSearch,
  } = useSearch(todos)
  const { form, editId, handleChange, resetForm, setEditMode, validateForm, getFormPayload } = useForm()

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("")
        setSuccess("")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    const payload = getFormPayload()

    if (editId) {
      await updateProduct(editId, payload)
    } else {
      await addProduct(payload)
    }

    resetForm()
  }

  const handleEdit = (todo) => {
    setEditMode(todo)
    setError("")
    setSuccess("")
  }

  const handleCancel = () => {
    resetForm()
    setError("")
    setSuccess("")
  }

  const total = filteredAndSortedTodos.reduce((sum, t) => sum + t.price * t.item, 0)
  const totalAllProducts = todos.reduce((sum, t) => sum + t.price * t.item, 0)

  return (
    <div className="app-container">
      <div className="app-content">
        <Header />

        <Message type="success" message={success} />
        <Message type="error" message={error} />

        <ProductForm
          form={form}
          editId={editId}
          loading={loading}
          onSubmit={handleSubmit}
          onChange={handleChange}
          onCancel={handleCancel}
        />

        <SearchFilter
          searchTerm={searchTerm}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          onSortByChange={(e) => setSortBy(e.target.value)}
          onSortOrderChange={(e) => setSortOrder(e.target.value)}
          onClearSearch={clearSearch}
          filteredCount={filteredAndSortedTodos.length}
          totalCount={todos.length}
        />

        <ProductTable
          products={filteredAndSortedTodos}
          searchTerm={searchTerm}
          totalCount={todos.length}
          filteredTotal={total}
          totalAllProducts={totalAllProducts}
          loading={loading}
          onEdit={handleEdit}
          onDelete={deleteProduct}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onClearSearch={clearSearch}
        />
      </div>
    </div>
  )
}
