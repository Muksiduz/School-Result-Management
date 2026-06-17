import pool from "./pool.js";
import { seedAdmin } from "./seedAdmin.js";

async function initDb() {
  try {
    const dbCheck = await pool.query("SELECT current_database()");
    console.log("Connected DB:", dbCheck.rows[0]);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      user_id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('admin', 'teacher', 'viewer')) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS classes (
      class_id SERIAL PRIMARY KEY,
      name TEXT NOT NULL
    )
  `);

    await pool.query(`
  CREATE TABLE IF NOT EXISTS sections (
    section_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    class_id INTEGER REFERENCES classes(class_id) ON DELETE CASCADE
  )
`);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS students (
      student_id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      roll_no TEXT,
      class_id INTEGER REFERENCES classes(class_id),
      section_id INTEGER REFERENCES sections(section_id),
      father_name TEXT,
      mother_name TEXT,
      phone TEXT,
      date_of_birth DATE,
      address TEXT,
      created_by TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS subjects (
      subject_id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      class_id INTEGER REFERENCES classes(class_id)
    )
  `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS academic_sessions (
      session_id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      year TEXT NOT NULL,
      start_date DATE,
      end_date DATE
    )
  `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS unit_tests (
      test_id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      session_id INTEGER REFERENCES academic_sessions(session_id),
      max_marks INTEGER NOT NULL
    )
  `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS results (
      id SERIAL PRIMARY KEY,
      student_id INTEGER REFERENCES students(student_id),
      class_id INTEGER REFERENCES classes(class_id),
      section_id INTEGER REFERENCES sections(section_id),
      session_id INTEGER REFERENCES academic_sessions(session_id),
      unit_test_id INTEGER REFERENCES unit_tests(test_id),
      subject_id INTEGER REFERENCES subjects(subject_id),
      marks_obtained INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (student_id, unit_test_id, subject_id)
    )
  `);

    console.log("Tables created");
  } catch (error) {
    console.log(error);
  }
}
export default initDb;
