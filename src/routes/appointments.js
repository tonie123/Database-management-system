const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, 
        p.name as patient_name,
        d.name as doctor_name
      FROM Appointments a
      JOIN Patients p ON a.patient_id = p.patient_id
      JOIN Doctors d ON a.doctor_id = d.doctor_id`
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// Get appointment by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, 
        p.name as patient_name,
        d.name as doctor_name
      FROM Appointments a
      JOIN Patients p ON a.patient_id = p.patient_id
      JOIN Doctors d ON a.doctor_id = d.doctor_id
      WHERE a.appointment_id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching appointment' });
  }
});

// Create new appointment
router.post('/', async (req, res) => {
  const { patient_id, doctor_id, appointment_date, status } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO Appointments (patient_id, doctor_id, appointment_date, status) VALUES (?, ?, ?, ?)',
      [patient_id, doctor_id, appointment_date, status]
    );
    res.status(201).json({
      id: result.insertId,
      patient_id,
      doctor_id,
      appointment_date,
      status
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating appointment' });
  }
});

// Update appointment
router.put('/:id', async (req, res) => {
  const { patient_id, doctor_id, appointment_date, status } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE Appointments SET patient_id = ?, doctor_id = ?, appointment_date = ?, status = ? WHERE appointment_id = ?',
      [patient_id, doctor_id, appointment_date, status, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({
      id: req.params.id,
      patient_id,
      doctor_id,
      appointment_date,
      status
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating appointment' });
  }
});

// Delete appointment
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM Appointments WHERE appointment_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting appointment' });
  }
});

module.exports = router;