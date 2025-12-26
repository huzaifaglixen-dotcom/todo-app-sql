const db = require('../db');

// Get all todos
const getAllTodos = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM todos', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Create a new todo
const createTodo = (title) => {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO todos (title) VALUES (?)', [title], function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, title, completed: 0 });
    });
  });
};

// Update only the title of a todo
const updateTodoTitle = (id, title) => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE todos SET title = ? WHERE id = ?',
      [title, id],
      function (err) {
        if (err) reject(err);
        else resolve({ id, title });
      }
    );
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
  updateTodoTitle,
  deleteTodo,
};
