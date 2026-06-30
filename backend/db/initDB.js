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

      is_active BOOLEAN DEFAULT true,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS classes (
      class_id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,

      is_active BOOLEAN DEFAULT true,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

    await pool.query(`
  CREATE TABLE IF NOT EXISTS sections (
    section_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    class_id INTEGER REFERENCES classes(class_id) ON DELETE CASCADE,

    is_active BOOLEAN DEFAULT true,

    UNIQUE(class_id, name)
  )
`);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS students (
      student_id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      roll_no VARCHAR(20) NOT NULL,
      
      class_id INTEGER REFERENCES classes(class_id),
      section_id INTEGER REFERENCES sections(section_id),

      father_name TEXT,
      mother_name TEXT,
      phone VARCHAR(20),
      gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
      date_of_birth DATE,
      address TEXT,

      religion VARCHAR(50),
      nationality VARCHAR(50),
      
      blood_group VARCHAR(5),

      date_of_joining DATE,
      date_of_leaving DATE,
      final_examination_held DATE,


      is_active BOOLEAN DEFAULT true,

      created_by TEXT,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      UNIQUE(class_id, section_id, roll_no)
  )
`);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS subjects (
      subject_id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      class_id INTEGER REFERENCES classes(class_id),

      is_active BOOLEAN DEFAULT true,

      UNIQUE(class_id, name)
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
      max_marks INTEGER NOT NULL,

      is_active BOOLEAN DEFAULT true,

      UNIQUE(session_id, name)
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

      is_active BOOLEAN DEFAULT true,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      UNIQUE (student_id, unit_test_id, subject_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS old_sessions (
      old_session_id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      year TEXT NOT NULL
    )
  `);

   await pool.query(`
    CREATE TABLE IF NOT EXISTS old_students(
      old_student_id SERIAL PRIMARY KEY ,
      name TEXT NOT NULL,
      roll_no VARCHAR(20) NOT NULL,
      old_session_id INTEGER REFERENCES old_sessions(old_session_id),
      class_name TEXT,
      section TEXT,
      father_name TEXT,
      mother_name TEXT,
      phone VARCHAR(20),
      gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
      date_of_birth DATE,
      address TEXT,

      religion VARCHAR(50),
      nationality VARCHAR(50),
      
      blood_group VARCHAR(5),

      date_of_joining DATE,
      date_of_leaving DATE,
      final_examination_held DATE,

      is_active BOOLEAN DEFAULT true,

      created_by TEXT,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

      )`);

    console.log("Tables created");
  } catch (error) {
    console.log(error);
  }
}
export default initDb;
