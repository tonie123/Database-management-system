const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all patients
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Patients');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching patients' });
  }
});

// Get patient by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Patients WHERE patient_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching patient' });
  }
});

// Create new patient
router.post('/', async (req, res) => {
  const { name, dob, phone } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO Patients (name, dob, phone) VALUES (?, ?, ?)',
      [name, dob, phone]
    );
    res.status(201).json({ id: result.insertId, name, dob, phone });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating patient' });
  }
});

// Update patient
router.put('/:id', async (req, res) => {
  const { name, dob, phone } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE Patients SET name = ?, dob = ?, phone = ? WHERE patient_id = ?',
      [name, dob, phone, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json({ id: req.params.id, name, dob, phone });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating patient' });
  }
});

// Delete patient
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM Patients WHERE patient_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting patient' });
  }
});

module.exports = router;