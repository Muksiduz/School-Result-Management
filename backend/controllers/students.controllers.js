import pool from "../db/pool.js";

// =========================================
// Get All Students
// =========================================
export async function getAllStudents(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        s.*,
        c.name AS class_name,
        sec.name AS section_name
      FROM students s
      LEFT JOIN classes c
        ON s.class_id = c.class_id
      LEFT JOIN sections sec
        ON s.section_id = sec.section_id
      ORDER BY s.name ASC
    `);

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
}

// =========================================
// Get Single Student
// =========================================
export async function getSingleStudent(req, res) {
  try {
    const result = await pool.query(
      `
      SELECT
        s.*,
        c.name AS class_name,
        sec.name AS section_name
      FROM students s
      LEFT JOIN classes c
        ON s.class_id = c.class_id
      LEFT JOIN sections sec
        ON s.section_id = sec.section_id
      WHERE s.student_id = $1
      `,
      [req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
}

// =========================================
// Get Students By Class
// =========================================
export async function getStudentsByClass(req, res) {
  try {
    const result = await pool.query(
      `
      SELECT
        s.*,
        sec.name AS section_name
      FROM students s
      LEFT JOIN sections sec
        ON s.section_id = sec.section_id
      WHERE s.class_id = $1
      ORDER BY s.name
      `,
      [req.params.id],
    );

    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
}

// =========================================
// Get Students By Class + Section
// =========================================
export async function getStudentsByClassAndSection(req, res) {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM students
      WHERE class_id = $1
      AND section_id = $2
      ORDER BY name
      `,
      [req.params.class_id, req.params.section_id],
    );

    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
}

// =========================================
// Create Student
// =========================================
export async function createStudent(req, res) {
  const {
    name,
    roll_no,
    class_id,
    section_id,
    father_name,
    mother_name,
    phone,
    gender,
    date_of_birth,
    address,
    religion,
    nationality,
    blood_group,
    date_of_joining,
    date_of_leaving,
    final_examination_held,
  } = req.body;

  const created_by = req.user.name;

  if (!["Male", "Female", "Other"].includes(gender)) {
    return res.status(400).json({
      message: "Invalid gender",
    });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO students
      (
        name,
        roll_no,
        class_id,
        section_id,
        father_name,
        mother_name,
        phone,
        gender,
        date_of_birth,
        address,
        religion,
        nationality,
        blood_group,
        date_of_joining,
        date_of_leaving,
        final_examination_held,
        created_by
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17
      )
      RETURNING *
      `,
      [
        name,
        roll_no,
        class_id,
        section_id,
        father_name,
        mother_name,
        phone,
        gender,
        date_of_birth,
        address,
        religion,
        nationality,
        blood_group,
        date_of_joining,
        date_of_leaving,
        final_examination_held,
        created_by,
      ],
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
}

// =========================================
// Update Student
// =========================================
export async function updateStudent(req, res) {
  const {
    name,
    roll_no,
    class_id,
    section_id,
    father_name,
    mother_name,
    phone,
    gender,
    date_of_birth,
    address,
    religion,
    nationality,
    blood_group,
    date_of_joining,
    date_of_leaving,
    final_examination_held,
  } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE students
      SET
        name=$1,
        roll_no=$2,
        class_id=$3,
        section_id=$4,
        father_name=$5,
        mother_name=$6,
        phone=$7,
        gender=$8,
        date_of_birth=$9,
        address=$10,
        religion=$11,
        nationality=$12,
        blood_group=$13,
        date_of_joining=$14,
        date_of_leaving=$15,
        final_examination_held=$16,
        updated_at=CURRENT_TIMESTAMP
      WHERE student_id=$17
      RETURNING *
      `,
      [
        name,
        roll_no,
        class_id,
        section_id,
        father_name,
        mother_name,
        phone,
        gender,
        date_of_birth,
        address,
        religion,
        nationality,
        blood_group,
        date_of_joining,
        date_of_leaving,
        final_examination_held,
        req.params.id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
}

// =========================================
// Delete Student
// =========================================
export async function deleteStudent(req, res) {
  try {
    const result = await pool.query(
      `
      DELETE FROM students
      WHERE student_id=$1
      RETURNING *
      `,
      [req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    return res.json({
      message: "Student deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
}

// =========================================
// Promote Student
// =========================================
export async function promoteStudent(req, res) {
  const { student_id } = req.params;
  const { class_id, section_id, roll_no } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE students
      SET
        class_id=$1,
        section_id=$2,
        roll_no=COALESCE($3, roll_no),
        updated_at=CURRENT_TIMESTAMP
      WHERE student_id=$4
      RETURNING *
      `,
      [class_id, section_id, roll_no, student_id],
    );

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
}
