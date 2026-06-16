import pool from "../db/pool.js";

export async function getAllUnitTest(req, res) {
  try {
    const result = await pool.query(
      `SELECT ut.*,s.name as session_name from unit_tests ut join academic_sessions s on ut.session_id = s.session_id ORDER BY s.year DESC`,
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getUnitTestBySession(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM unit_tests WHERE session_id=$1 ORDER BY name`,
      [id],
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function createUnitTest(req, res) {
  const { name, session_id, max_marks } = req.body;
  if (!name || !session_id || !max_marks) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const result = await pool.query(
      `INSERT INTO unit_tests (name, session_id, max_marks) 
       VALUES ($1, $2, $3) RETURNING *`,
      [name, session_id, max_marks],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function updateUnitTest(req, res) {
  const { name, max_marks } = req.body;
  if (!name || !max_marks) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const result = await pool.query(
      `UPDATE unit_tests SET name=$1, max_marks=$2 WHERE test_id=$3 RETURNING *`,
      [name, max_marks, req.params.id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Unit test not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function deleteUnitTest(req, res) {
  try {
    const result = await pool.query(
      `DELETE FROM unit_tests WHERE test_id=$1 RETURNING *`,
      [req.params.id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Unit test not found" });
    res.json({ message: "Unit test deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
