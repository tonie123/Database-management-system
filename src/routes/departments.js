const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all departments
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Departments');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching departments' });
  }
});

// Get department by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Departments WHERE department_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching department' });
  }
});

// Create new department
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO Departments (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating department' });
  }
});

// Update department
router.put('/:id', async (req, res) => {
  const { name } = req.body;
  try {
    const [result] = await pool.query('UPDATE Departments SET name = ? WHERE department_id = ?', [name, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json({ id: req.params.id, name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating department' });
  }
});

// Delete department
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM Departments WHERE department_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting department' });
  }
});

module.exports = router;