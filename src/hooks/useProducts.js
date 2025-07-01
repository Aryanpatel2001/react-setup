"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const API_URL = "http://localhost:5000/api/todos"

export function useProducts() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

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

  const addProduct = async (payload) => {
    try {
      setLoading(true)
      await axios.post(API_URL, payload)
      setSuccess("Product added successfully!")
      fetchTodos()
    } catch (error) {
      setError("Failed to save product. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const updateProduct = async (id, payload) => {
    try {
      setLoading(true)
      await axios.put(`${API_URL}/${id}`, payload)
      setSuccess("Product updated successfully!")
      fetchTodos()
    } catch (error) {
      setError("Failed to update product. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id) => {
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

  return {
    todos,
    loading,
    error,
    success,
    addProduct,
    updateProduct,
    deleteProduct,
    setError,
    setSuccess,
  }
}
