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

export async function createStudent(req, res) {
  const {
    //removed section_id
    name,
    roll_no,
    class_id,
    father_name,
    mother_name,
    phone,
    date_of_birth,
    address,
  } = req.body;
  const created_by = req.user.name;
  try {
    const result = await pool.query(
      //changed the class_id to id and removed section id and removed createed_by
      `INSERT INTO students (name, roll_no, class_id,  father_name, mother_name, phone, date_of_birth, address)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [
        name,
        roll_no,
        class_id,
        //        section_id,
        father_name,
        mother_name,
        phone,
        date_of_birth,
        address,
        created_by,
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
  } = req.body;
  try {
    const result = await pool.query(
      `UPDATE students SET name=$1, roll_no=$2, class_id=$3, section_id=$4, 
       father_name=$5, mother_name=$6, phone=$7, date_of_birth=$8, address=$9
       WHERE student_id=$10 RETURNING *`,
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
  }
}
