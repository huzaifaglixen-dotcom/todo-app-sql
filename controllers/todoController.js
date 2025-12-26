const Todo = require('../models/todoModel');

// Get all todos
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.getAllTodos();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new todo
const createTodo = async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  try {
    const todo = await Todo.createTodo(title);
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update todo
const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  if (!title) return res.status(400).json({ message: "Title is required" });

  try {
    const todo = await Todo.updateTodoTitle(id, title);
    res.json(todo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a todo
const deleteTodo = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Todo.deleteTodo(id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
