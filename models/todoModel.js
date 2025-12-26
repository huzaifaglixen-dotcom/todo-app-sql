const db = require('../db');

// Get all todos (newest first)
const getAllTodos = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM todos ORDER BY id DESC', [], (err, rows) => {
      if (err) reject(err);
      else
        resolve(
          rows.map((row) => ({
            id: row.id,
            title: row.title,
            completed: !!row.completed, // convert 0/1 to boolean
          }))
        );
    });
  });
};

// Create a new todo (completed defaults to false)
const createTodo = (title, completed = false) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO todos (title, completed) VALUES (?, ?)',
      [title, completed ? 1 : 0],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, title, completed });
      }
    );
  });
};

// Update todo (title and/or completed)
const updateTodo = (id, title, completed) => {
  return new Promise((resolve, reject) => {
    const updates = [];
    const params = [];

    if (title !== undefined && title !== null) {
      updates.push('title = ?');
      params.push(title);
    }

    if (completed !== undefined) {
      updates.push('completed = ?');
      params.push(completed ? 1 : 0);
    }

    if (updates.length === 0) {
      return reject(new Error('No fields to update'));
    }

    params.push(id);

    db.run(`UPDATE todos SET ${updates.join(', ')} WHERE id = ?`, params, function (err) {
      if (err) reject(err);
      else resolve({ id, title, completed });
    });
  });
};

// Delete a todo
const deleteTodo = (id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM todos WHERE id = ?', [id], function (err) {
      if (err) reject(err);
      else resolve({ message: 'Todo deleted successfully' });
    });
  });
};

module.exports = {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
