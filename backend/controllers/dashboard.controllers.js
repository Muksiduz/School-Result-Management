import pool from "../db/pool.js";

export async function getDashboardData(req, res) {
  try {
    // Total Students
    const students = await pool.query(`
      SELECT COUNT(*) as total
      FROM students
    `);

    // Male Students
    const maleStudents = await pool.query(`
      SELECT COUNT(*) as total
      FROM students
      WHERE LOWER(gender) = 'male'
    `);

    // Female Students
    const femaleStudents = await pool.query(`
      SELECT COUNT(*) as total
      FROM students
      WHERE LOWER(gender) = 'female'
    `);

    // Classes
    const classes = await pool.query(`
      SELECT COUNT(*) as total
      FROM classes
    `);

    // Exams
    const exams = await pool.query(`
      SELECT COUNT(*) as total
      FROM unit_tests
    `);

    // Current Session
    const currentSession = await pool.query(`
      SELECT *
      FROM academic_sessions
      ORDER BY session_id DESC
      LIMIT 1
    `);

    // Students Per Class
    const classWiseStudents = await pool.query(`
      SELECT
        c.class_id,
        c.name,
        COUNT(s.student_id) as total_students
      FROM classes c
      LEFT JOIN students s
      ON c.class_id = s.class_id
      GROUP BY c.class_id,c.name
      ORDER BY c.class_id
    `);

    // Recent Students
    const recentStudents = await pool.query(`
      SELECT
        student_id,
        name,
        roll_no
      FROM students
      ORDER BY student_id DESC
      LIMIT 5
    `);

    res.status(200).json({
      totalStudents: Number(students.rows[0].total),

      maleStudents: Number(maleStudents.rows[0].total),

      femaleStudents: Number(femaleStudents.rows[0].total),

      totalClasses: Number(classes.rows[0].total),

      totalExams: Number(exams.rows[0].total),

      currentSession: currentSession.rows[0] || null,

      classWiseStudents: classWiseStudents.rows,

      recentStudents: recentStudents.rows,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
}
