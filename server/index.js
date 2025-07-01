const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://patelaryan2707:patelaryan2707@cluster0.ibjwyid.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const TodoSchema = new mongoose.Schema({
  product: String,
  price: Number,
  item: Number,
});

const Todo = mongoose.model("Todo", TodoSchema);

// Get all todos
app.get("/api/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// Add new todo
app.post("/api/todos", async (req, res) => {
  const newTodo = new Todo(req.body);
  await newTodo.save();
  res.json(newTodo);
});

// Update todo
app.put("/api/todos/:id", async (req, res) => {
  const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete todo
app.delete("/api/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
