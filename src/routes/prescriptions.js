const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all prescriptions with medications
router.get('/', async (req, res) => {
  try {
    const [prescriptions] = await pool.query(
      `SELECT p.*, 
        a.appointment_date,
        pt.name as patient_name,
        d.name as doctor_name
      FROM Prescriptions p
      JOIN Appointments a ON p.appointment_id = a.appointment_id
      JOIN Patients pt ON a.patient_id = pt.patient_id
      JOIN Doctors d ON a.doctor_id = d.doctor_id`
    );

    // Get medications for each prescription
    for (let prescription of prescriptions) {
      const [medications] = await pool.query(
        `SELECT m.*, pm.dosage
        FROM Prescription_Medications pm
        JOIN Medications m ON pm.medication_id = m.medication_id
        WHERE pm.prescription_id = ?`,
        [prescription.prescription_id]
      );
      prescription.medications = medications;
    }

    res.json(prescriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching prescriptions' });
  }
});

// Get prescription by ID
router.get('/:id', async (req, res) => {
  try {
    const [prescriptions] = await pool.query(
      `SELECT p.*, 
        a.appointment_date,
        pt.name as patient_name,
        d.name as doctor_name
      FROM Prescriptions p
      JOIN Appointments a ON p.appointment_id = a.appointment_id
      JOIN Patients pt ON a.patient_id = pt.patient_id
      JOIN Doctors d ON a.doctor_id = d.doctor_id
      WHERE p.prescription_id = ?`,
      [req.params.id]
    );

    if (prescriptions.length === 0) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    const prescription = prescriptions[0];

    // Get medications for this prescription
    const [medications] = await pool.query(
      `SELECT m.*, pm.dosage
      FROM Prescription_Medications pm
      JOIN Medications m ON pm.medication_id = m.medication_id
      WHERE pm.prescription_id = ?`,
      [prescription.prescription_id]
    );
    prescription.medications = medications;

    res.json(prescription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching prescription' });
  }
});

// Create new prescription
router.post('/', async (req, res) => {
  const { appointment_id, notes, medications } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Create prescription
    const [result] = await connection.query(
      'INSERT INTO Prescriptions (appointment_id, notes) VALUES (?, ?)',
      [appointment_id, notes]
    );
    const prescriptionId = result.insertId;

    // Add medications to prescription
    if (medications && medications.length > 0) {
      for (const med of medications) {
        await connection.query(
          'INSERT INTO Prescription_Medications (prescription_id, medication_id, dosage) VALUES (?, ?, ?)',
          [prescriptionId, med.medication_id, med.dosage]
        );
      }
    }

    await connection.commit();
    res.status(201).json({
      id: prescriptionId,
      appointment_id,
      notes,
      medications
    });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error creating prescription' });
  } finally {
    connection.release();
  }
});

// Update prescription
router.put('/:id', async (req, res) => {
  const { notes, medications } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Update prescription notes
    const [result] = await connection.query(
      'UPDATE Prescriptions SET notes = ? WHERE prescription_id = ?',
      [notes, req.params.id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Update medications
    if (medications && medications.length > 0) {
      // Remove existing medications
      await connection.query(
        'DELETE FROM Prescription_Medications WHERE prescription_id = ?',
        [req.params.id]
      );

      // Add new medications
      for (const med of medications) {
        await connection.query(
          'INSERT INTO Prescription_Medications (prescription_id, medication_id, dosage) VALUES (?, ?, ?)',
          [req.params.id, med.medication_id, med.dosage]
        );
      }
    }

    await connection.commit();
    res.json({
      id: req.params.id,
      notes,
      medications
    });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error updating prescription' });
  } finally {
    connection.release();
  }
});

// Delete prescription
router.delete('/:id', async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Delete prescription medications first
    await connection.query(
      'DELETE FROM Prescription_Medications WHERE prescription_id = ?',
      [req.params.id]
    );

    // Delete prescription
    const [result] = await connection.query(
      'DELETE FROM Prescriptions WHERE prescription_id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Prescription not found' });
    }

    await connection.commit();
    res.status(204).send();
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error deleting prescription' });
  } finally {
    connection.release();
  }
});

module.exports = router;