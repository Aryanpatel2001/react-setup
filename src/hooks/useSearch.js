"use client"

import { useState, useMemo } from "react"

export function useSearch(todos) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")

  const filteredAndSortedTodos = useMemo(() => {
    const filtered = todos.filter((todo) => todo.product.toLowerCase().includes(searchTerm.toLowerCase()))

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

  return {
    searchTerm,
    sortBy,
    sortOrder,
    filteredAndSortedTodos,
    setSearchTerm,
    setSortBy,
    setSortOrder,
    handleSort,
    clearSearch,
  }
}
