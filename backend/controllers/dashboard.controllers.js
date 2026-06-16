import pool from "../db/pool.js";

export async function getDashboardData(req, res) {
  try {
    const students = await pool.query("SELECT COUNT(*) FROM students");

    const classes = await pool.query("SELECT COUNT(*) FROM classes");

    const subjects = await pool.query("SELECT COUNT(*) FROM subjects");

    const sections = await pool.query("SELECT COUNT(*) FROM sections");

    const sessions = await pool.query("SELECT COUNT(*) FROM academic_sessions");

    const exams = await pool.query("SELECT COUNT(*) FROM unit_tests");

    const recentStudents = await pool.query(`
      SELECT student_id,name,roll_no
      FROM students
      ORDER BY student_id DESC
      LIMIT 5
    `);

    res.json({
      students: Number(students.rows[0].count),
      classes: Number(classes.rows[0].count),
      subjects: Number(subjects.rows[0].count),
      sections: Number(sections.rows[0].count),
      sessions: Number(sessions.rows[0].count),
      exams: Number(exams.rows[0].count),
      recentStudents: recentStudents.rows,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
