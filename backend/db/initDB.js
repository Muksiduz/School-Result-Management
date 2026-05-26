import pool from "./pool.js";
import { seedAdmin } from "./seedAdmin.js";

async function initDb() {
  try {
    const dbCheck = await pool.query("SELECT current_database()");
    console.log("Connected DB:", dbCheck.rows[0]);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('admin', 'teacher', 'viewer')) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS classes (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL
    )
  `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS subjects (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      class_id INTEGER REFERENCES classes(id)
    )
  `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS academic_sessions (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      year TEXT NOT NULL,
      start_date DATE,
      end_date DATE
    )
  `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS unit_tests (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      session_id INTEGER REFERENCES academic_sessions(id),
      max_marks INTEGER NOT NULL
    )
  `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS results (
      id SERIAL PRIMARY KEY,
      student_id INTEGER REFERENCES students(id),
      class_id INTEGER REFERENCES classes(id),
      session_id INTEGER REFERENCES academic_sessions(id),
      unit_test_id INTEGER REFERENCES unit_tests(id),
      subject_id INTEGER REFERENCES subjects(id),
      marks_obtained INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

    console.log("Tables created");
  } catch (error) {
    console.log(error);
  }
}
export default initDb;
