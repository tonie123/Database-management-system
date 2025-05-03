const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all payments
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, 
        a.appointment_date,
        pt.name as patient_name,
        d.name as doctor_name
      FROM Payments p
      JOIN Appointments a ON p.appointment_id = a.appointment_id
      JOIN Patients pt ON a.patient_id = pt.patient_id
      JOIN Doctors d ON a.doctor_id = d.doctor_id`
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching payments' });
  }
});

// Get payment by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, 
        a.appointment_date,
        pt.name as patient_name,
        d.name as doctor_name
      FROM Payments p
      JOIN Appointments a ON p.appointment_id = a.appointment_id
      JOIN Patients pt ON a.patient_id = pt.patient_id
      JOIN Doctors d ON a.doctor_id = d.doctor_id
      WHERE p.payment_id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching payment' });
  }
});

// Create new payment
router.post('/', async (req, res) => {
  const { appointment_id, amount, payment_date } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO Payments (appointment_id, amount, payment_date) VALUES (?, ?, ?)',
      [appointment_id, amount, payment_date]
    );
    res.status(201).json({
      id: result.insertId,
      appointment_id,
      amount,
      payment_date
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating payment' });
  }
});

// Update payment
router.put('/:id', async (req, res) => {
  const { appointment_id, amount, payment_date } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE Payments SET appointment_id = ?, amount = ?, payment_date = ? WHERE payment_id = ?',
      [appointment_id, amount, payment_date, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json({
      id: req.params.id,
      appointment_id,
      amount,
      payment_date
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating payment' });
  }
});

// Delete payment
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM Payments WHERE payment_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting payment' });
  }
});

module.exports = router;