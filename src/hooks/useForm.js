"use client"

import { useState } from "react"

export function useForm(initialState = { product: "", price: "", item: "" }) {
  const [form, setForm] = useState(initialState)
  const [editId, setEditId] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setForm(initialState)
    setEditId(null)
  }

  const setEditMode = (todo) => {
    setForm({
      product: todo.product,
      price: todo.price.toString(),
      item: todo.item.toString(),
    })
    setEditId(todo._id)
  }

  const validateForm = () => {
    if (!form.product || form.product.trim().length < 3) {
      return "Product name must be at least 3 characters long."
    }

    const price = Number.parseFloat(form.price)
    const item = Number.parseInt(form.item)

    if (isNaN(price) || price <= 0) {
      return "Price must be a positive number."
    }

    if (isNaN(item) || item < 1) {
      return "Item count must be at least 1."
    }

    return null
  }

  const getFormPayload = () => {
    return {
      product: form.product.trim(),
      price: Number.parseFloat(form.price),
      item: Number.parseInt(form.item),
    }
  }

  return {
    form,
    editId,
    handleChange,
    resetForm,
    setEditMode,
    validateForm,
    getFormPayload,
  }
}
        