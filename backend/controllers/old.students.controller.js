import pool from "../db/pool.js";

export async function getAllOldStudents(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        st.*,
        ses.old_session_id,
        ses.name AS session_name,
        ses.year AS session_year
      FROM old_students st
      LEFT JOIN old_sessions ses
      ON st.old_session_id = ses.old_session_id
      ORDER BY st.name ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
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
                  SELECT st.* , ses.old_session_id, ses.name AS session_name, ses.year
                  FROM old_students st
                  JOIN old_sessions ses ON st.old_session_id = ses.old_session_id
                  WHERE st.old_session_id = $1
                  ORDER BY st.name ASC`,
      [id],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
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
    religion,
    nationality,
    date_of_joining,
    date_of_leaving,
    final_examination_held,
    
  } = req.body;

  const created_by = req.user.name;
  if (!name.trim() || !roll_no) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO old_students (
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
        religion,
        nationality,
        date_of_joining,
        date_of_leaving,
        final_examination_held,
        created_by
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17
      )
      RETURNING *`,
      [
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
        religion,
        nationality,
        date_of_joining,
        date_of_leaving,
        final_examination_held,
        created_by,
      ],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
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
    religion,
    nationality,
    date_of_joining,
    date_of_leaving,
    final_examination_held,
    created_by,
  } = req.body;

  if (!name.trim() || !roll_no) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE old_students
      SET
        name=$1,
        roll_no=$2,
        old_session_id=$3,
        class_name=$4,
        section=$5,
        father_name=$6,
        mother_name=$7,
        phone=$8,
        gender=$9,
        date_of_birth=$10,
        address=$11,
        religion=$12,
        nationality=$13,
        date_of_joining=$14,
        date_of_leaving=$15,
        final_examination_held=$16,
        created_by=$17
      WHERE old_student_id=$18
      RETURNING *`,
      [
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
        religion,
        nationality,
        date_of_joining,
        date_of_leaving,
        final_examination_held,
        created_by,
        id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Old student not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
}
export async function deleteOldStudents(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM old_students WHERE old_student_id=$1 RETURNING *`,
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
