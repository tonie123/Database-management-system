const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT d.*, dept.name as department_name FROM Doctors d LEFT JOIN Departments dept ON d.department_id = dept.department_id'
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT d.*, dept.name as department_name FROM Doctors d LEFT JOIN Departments dept ON d.department_id = dept.department_id WHERE d.doctor_id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching doctor' });
  }
});

// Create new doctor
router.post('/', async (req, res) => {
  const { name, department_id, specialization } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO Doctors (name, department_id, specialization) VALUES (?, ?, ?)',
      [name, department_id, specialization]
    );
    res.status(201).json({ id: result.insertId, name, department_id, specialization });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating doctor' });
  }
});

// Update doctor
router.put('/:id', async (req, res) => {
  const { name, department_id, specialization } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE Doctors SET name = ?, department_id = ?, specialization = ? WHERE doctor_id = ?',
      [name, department_id, specialization, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ id: req.params.id, name, department_id, specialization });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating doctor' });
  }
});

// Delete doctor
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM Doctors WHERE doctor_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting doctor' });
  }
});

module.exports = router;