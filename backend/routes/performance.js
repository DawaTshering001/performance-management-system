const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const authenticateToken = require('../middleware/authMiddleware');

const db = new sqlite3.Database('./database/performance.db');

db.run(`CREATE TABLE IF NOT EXISTS performance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER,
  title TEXT,
  description TEXT,
  rating INTEGER,
  date TEXT
)`);

// Get user's performance records
router.get('/', authenticateToken, (req, res) => {
  db.all(`SELECT * FROM performance WHERE userId = ?`, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error' });
    res.json(rows);
  });
});

// Add record
router.post('/', authenticateToken, (req, res) => {
  const { title, description, rating, date } = req.body;
  db.run(`INSERT INTO performance (userId, title, description, rating, date) VALUES (?, ?, ?, ?, ?)`, 
  [req.user.id, title, description, rating, date], function(err) {
    if (err) return res.status(500).json({ message: 'Error' });
    res.json({ id: this.lastID });
  });
});

// Update record
router.put('/:id', authenticateToken, (req, res) => {
  const { title, description, rating, date } = req.body;
  const { id } = req.params;
  db.run(`UPDATE performance SET title=?, description=?, rating=?, date=? WHERE id=? AND userId=?`,
   [title, description, rating, date, id, req.user.id], function(err) {
    if (err) return res.status(500).json({ message: 'Error' });
    res.json({ message: 'Updated' });
  });
});

// Delete record
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM performance WHERE id=? AND userId=?`, [id, req.user.id], function(err) {
    if (err) return res.status(500).json({ message: 'Error' });
    res.json({ message: 'Deleted' });
  });
});

module.exports = router;
