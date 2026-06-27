import pool from "../db/pool.js";

export async function getAllOldStudents(req, res) {
  try {
    const result = await pool.query(
      `SELECT * FROM old_students ORDER BY name ASC`,
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No old students found" });
    }
    res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
    console.error(error);
  }
}

export async function getSingleOldStudents(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
            SELECT * FROM old_students 
            WHERE old_student_id = $1`,
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Old student not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
    console.error(error);
  }
}

export async function getOldStudentsBySession(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
                SELECT * FROM old_students 
                WHERE session_id = $1`,
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Old student not found" });
    }
    res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
    console.error(error);
  }
}

export async function createOldStudents(req, res) {
  const {
    name,
    roll_no,
    old_session_id,
    class_name,
    section,
    father_name,
    mother_name,
    phone,
    gender,
    date_of_birth,
    address,
    created_by,
  } = req.body;
  if(!name.trim() || !roll_no ){
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const result = await pool.query(
        `INSERT INTO old_students (name, roll_no, old_session_id, class_name, section, father_name, mother_name, phone, gender, date_of_birth, address, created_by) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
        RETURNING *`,
        [name, roll_no, old_session_id, class_name, section, father_name, mother_name, phone, gender, date_of_birth, address, created_by]
    )
    res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
    console.error(error);
  }
}


export async function updateOldStudents(req, res) {
  const { id } = req.params;
  const {
    name,
    roll_no,
    old_session_id,
    class_name,
    section,
    father_name,
    mother_name,
    phone,
    gender,
    date_of_birth,
    address,
    created_by,
  } = req.body;
  if(!name.trim() || !roll_no ){
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const result = await pool.query(
        `UPDATE old_students SET name=$1, roll_no=$2, old_session_id=$3, class_name=$4, section=$5, father_name=$6, mother_name=$7, phone=$8, gender=$9, date_of_birth=$10, address=$11, created_by=$12 
        WHERE old_student_id=$13 RETURNING *`,
        [name, roll_no, old_session_id, class_name, section, father_name, mother_name, phone, gender, date_of_birth, address, created_by, id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Old student not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
    console.error(error);
  }
}


export async function deleteOldStudents(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
        `DELETE FROM old_students WHERE old_student_id=$1 RETURNING *`,
        [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Old student not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
    console.error(error);
  }
}