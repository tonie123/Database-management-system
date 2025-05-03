const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all medications
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Medications');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching medications' });
  }
});

// Get medication by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Medications WHERE medication_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching medication' });
  }
});

// Create new medication
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO Medications (name, description) VALUES (?, ?)',
      [name, description]
    );
    res.status(201).json({
      id: result.insertId,
      name,
      description
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating medication' });
  }
});

// Update medication
router.put('/:id', async (req, res) => {
  const { name, description } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE Medications SET name = ?, description = ? WHERE medication_id = ?',
      [name, description, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    res.json({
      id: req.params.id,
      name,
      description
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating medication' });
  }
});

// Delete medication
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM Medications WHERE medication_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting medication' });
  }
});

module.exports = router;