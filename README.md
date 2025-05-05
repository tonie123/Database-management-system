# Database-management-
# 🏥 Clinic Booking System + 📝 Task Manager CRUD API

## 📌 Project Overview

This repository contains **two parts**:

1️⃣ **Clinic Booking System (MySQL Database)**  
A complete, well-structured relational database designed using only MySQL for managing clinic operations, including patients, doctors, appointments, payments, and prescriptions.

2️⃣ **Task Manager CRUD API (FastAPI + MySQL)**  
A simple CRUD API built with **FastAPI** (Python) connected to a MySQL database. This API allows users to manage tasks and categories efficiently, performing Create, Read, Update, and Delete operations.

---

## ✅ Question 1: Clinic Booking System (Database Only)

### 📂 Files

- `clinic_booking_system.sql`  
  👉 A **single, well-commented SQL file** that includes:
  - `CREATE TABLE` statements with full constraints (PK, FK, NOT NULL, UNIQUE)
  - Relationships (1-1, 1-M, M-M)
  - Sample data inserts for testing

### 📈 ERD

![Clinic Booking System ERD]![WhatsApp Image 2025-05-05 at 16 45 36_d6f9fe07](https://github.com/user-attachments/assets/320e70ba-136b-45ac-9abb-5c745484ec44)


*(Replace the link above with your ERD screenshot or diagram link.)*

---

## 🚀 Question 2: Task Manager CRUD API

### 📂 Files

- `/app`
  - `main.py` (FastAPI entry point)
  - `/models` (SQLAlchemy models)
  - `/schemas` (Pydantic schemas)
  - `/crud` (CRUD operations)
  - `/database.py` (DB connection setup)
- `requirements.txt` (Python dependencies)
- `task_manager.sql` (SQL script to set up the Task Manager DB)

### ✨ Features

- FastAPI + SQLAlchemy + MySQL
- CRUD endpoints for tasks:
  - `POST /tasks/`
  - `GET /tasks/`
  - `GET /tasks/{task_id}`
  - `PUT /tasks/{task_id}`
  - `DELETE /tasks/{task_id}`
- Categories endpoint for managing task categories

### 🛠 How to Run

1️⃣ **Clone the Repository**

```bash
git clone https://github.com/tonie123/Database-management-system.git
cd your-repo-tonie
