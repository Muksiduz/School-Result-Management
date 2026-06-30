import pool from "../db/pool.js";

export async function getAllStudents(req, res) {
  try {
    const result = await pool.query(
      `SELECT s.*, c.name as class_name, sec.name as section_name
       FROM students s
       LEFT JOIN classes c ON s.class_id = c.class_id
       LEFT JOIN sections sec ON s.section_id = sec.section_id
       ORDER BY s.name`,
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getSingleStudent(req, res) {
  try {
    const result = await pool.query(
      `SELECT s.*, c.name as class_name, sec.name as section_name
       FROM students s
       LEFT JOIN classes c ON s.class_id = c.class_id
       LEFT JOIN sections sec ON s.section_id = sec.section_id
       WHERE s.student_id = $1`,
      [req.params.id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Student not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getStudentsByClass(req, res) {
  const { id } = req.params;
  try {
    const result = pool.query(
      `SELECT s.*, sec.name as section_name 
            FROM students s 
            LEFT JOIN sections sec ON  s.section_id = sec.section_id 
            WHERE s.class_id = $1 
            ORDER BY s.name `,
      [id],
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
}

export async function getStudentsByClassAndSection(req, res) {
  try {
    const result = await pool.query(
      `SELECT * FROM students 
         WHERE class_id = $1 AND section_id = $2
         ORDER BY name`,
      [req.params.class_id, req.params.section_id],
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function createStudent(req, res) {
  const {
    name,
    roll_no,
    class_id,
    section_id,
    father_name,
    mother_name,
    phone,
    date_of_birth,
    address,
    gender,
    religion,
    nationality,
    date_of_joining,
  } = req.body;

  const created_by = req.user.name;

  if (!["Male", "Female", "Other"].includes(gender)) {
    return res.status(400).json({
      message: "Invalid gender",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO students (name, roll_no, class_id,section_id,  father_name, mother_name, phone, date_of_birth, address,created_by,gender,religion,nationality,date_of_joining)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
      [
        name,
        roll_no,
        class_id,
        section_id,
        father_name,
        mother_name,
        phone,
        date_of_birth,
        address,
        created_by,
        gender,
        religion,
        nationality,
        date_of_joining,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
}

export async function updateStudent(req, res) {
  const {
    name,
    roll_no,
    class_id,
    section_id,
    father_name,
    mother_name,
    phone,
    date_of_birth,
    address,
    gender,
    religion,
    nationality,
    date_of_joining,
  } = req.body;
  try {
    const result = await pool.query(
      `UPDATE students
SET
  name = COALESCE($1, name),
  roll_no = COALESCE($2, roll_no),
  class_id = COALESCE($3, class_id),
  section_id = COALESCE($4, section_id),
  father_name = COALESCE($5, father_name),
  mother_name = COALESCE($6, mother_name),
  phone = COALESCE($7, phone),
  date_of_birth = COALESCE($8, date_of_birth),
  address = COALESCE($9, address),
  gender = COALESCE($11, gender),
  religion = COALESCE($12, religion),
  nationality = COALESCE($13, nationality),
  date_of_joining = COALESCE($14, date_of_joining)
WHERE student_id = $10
RETURNING *;`,
      [
        name,
        roll_no,
        class_id,
        section_id,
        father_name,
        mother_name,
        phone,
        date_of_birth,
        address,
        req.params.id,
        gender,
        religion,
        nationality,
        date_of_joining,
      ],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Student not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function deleteStudent(req, res) {
  console.log(req.params.id);
  try {
    const result = await pool.query(
      `DELETE FROM students WHERE student_id=$1 RETURNING *`,
      [req.params.id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
}

export async function promoteStudent(req, res) {
  const { student_id } = req.params;
  const { class_id, section_id, roll_no } = req.body;
  try {
    if (roll_no) {
      const result = await pool.query(
        `
        UPDATE students SET class_id = $1, section_id = $2, roll_no = $3
        WHERE student_id = $4 RETURNING *
        `,
        [class_id, section_id, roll_no, student_id],
      );
      return res.status(200).json(result.rows[0]);
    } else {
      const result = await pool.query(
        `
      UPDATE students SET class_id = $1, section_id = $2
      WHERE student_id = $3 RETURNING *
      `,
        [class_id, section_id, student_id],
      );
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
}
