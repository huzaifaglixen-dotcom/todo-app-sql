const bcrypt = require('bcryptjs');
const db = require('../db');
const generateToken = require('../utils/generateToken');

// SIGNUP
exports.signup = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email & password required" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `INSERT INTO users (email, password) VALUES (?, ?)`;
  db.run(query, [email, hashedPassword], function(err) {
    if (err) return res.status(400).json({ message: "User already exists" });
    const user = { id: this.lastID, email };
    const token = generateToken(user);
    res.status(201).json({ user, token });
  });
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ?`;
  db.get(query, [email], async (err, user) => {
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken({ id: user.id, email: user.email });
    res.json({ user: { id: user.id, email: user.email }, token });
  });
};
