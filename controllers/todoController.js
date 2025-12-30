const db = require('../db');

// Get all todos for logged-in user
exports.getTodos = (req, res) => {
  const query = `SELECT * FROM todos WHERE userId = ?`;
  db.all(query, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
};

// Add new todo
exports.addTodo = (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Title required" });

  const query = `INSERT INTO todos (userId, title) VALUES (?, ?)`;
  db.run(query, [req.user.id, title], function(err) {
    if (err) return res.status(500).json({ message: err.message });
    res.status(201).json({ id: this.lastID, userId: req.user.id, title, completed: 0 });
  });
};

// Update todo
exports.updateTodo = (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const query = `UPDATE todos SET title = COALESCE(?, title), completed = COALESCE(?, completed) WHERE id = ? AND userId = ?`;
  db.run(query, [title, completed, id, req.user.id], function(err) {
    if (err) return res.status(500).json({ message: err.message });
    if (this.changes === 0) return res.status(404).json({ message: "Todo not found" });
    res.json({ id, title, completed });
  });
};

// Delete todo
exports.deleteTodo = (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM todos WHERE id = ? AND userId = ?`;
  db.run(query, [id, req.user.id], function(err) {
    if (err) return res.status(500).json({ message: err.message });
    if (this.changes === 0) return res.status(404).json({ message: "Todo not found" });
    res.json({ message: "Todo deleted" });
  });
};
