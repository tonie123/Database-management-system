-- Question 1
CREATE TABLE Departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Doctors (
    doctor_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    department_id INT,
    specialization VARCHAR(100),
    UNIQUE (name, department_id),
    FOREIGN KEY (department_id) REFERENCES Departments(department_id)
);

CREATE TABLE Patients (
    patient_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL
);

CREATE TABLE Appointments (
    appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATETIME NOT NULL,
    status ENUM('Scheduled', 'Completed', 'Cancelled') NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id)
);

CREATE TABLE Payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT UNIQUE,
    amount DECIMAL(8, 2) NOT NULL,
    payment_date DATE NOT NULL,
    FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id)
);

CREATE TABLE Medications (
    medication_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE Prescriptions (
    prescription_id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT NOT NULL,
    notes TEXT,
    FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id)
);

CREATE TABLE Prescription_Medications (
    prescription_id INT,
    medication_id INT,
    dosage VARCHAR(50),
    PRIMARY KEY (prescription_id, medication_id),
    FOREIGN KEY (prescription_id) REFERENCES Prescriptions(prescription_id),
    FOREIGN KEY (medication_id) REFERENCES Medications(medication_id)
);
INSERT INTO Departments (name) VALUES ('Cardiology'), ('Dermatology');

INSERT INTO Doctors (name, department_id, specialization)
VALUES ('Dr. Smith', 1, 'Heart Specialist'), ('Dr. Lee', 2, 'Skin Specialist');

INSERT INTO Patients (name, dob, phone)
VALUES ('John Doe', '1985-06-15', '555-1234'), ('Jane Roe', '1990-08-22', '555-5678');

INSERT INTO Appointments (patient_id, doctor_id, appointment_date, status)
VALUES (1, 1, '2025-05-10 10:00:00', 'Scheduled'), (2, 2, '2025-05-11 14:00:00', 'Completed');

INSERT INTO Payments (appointment_id, amount, payment_date)
VALUES (2, 150.00, '2025-05-11');

INSERT INTO Medications (name, description)
VALUES ('Aspirin', 'Pain reliever'), ('Cortisone', 'Anti-inflammatory');

INSERT INTO Prescriptions (appointment_id, notes)
VALUES (2, 'Take Aspirin twice daily.');

INSERT INTO Prescription_Medications (prescription_id, medication_id, dosage)
VALUES (1, 1, '100mg twice daily');
