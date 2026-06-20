import pool from "../db/pool.js";
export async function getAllSessions(req, res) {
  try {
    const result = await pool.query(
      `SELECT * FROM academic_sessions ORDER BY year DESC`,
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
export async function getSingleSession(req, res) {
  try {
    const result = await pool.query(
      `SELECT * FROM academic_sessions WHERE id=$1`,
      [req.params.id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Session not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
export async function createSession(req, res) {
  const { name, year, start_date, end_date } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO academic_sessions (name, year, start_date, end_date) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, year, start_date, end_date],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
export async function updateSession(req, res) {
  const { name, year, start_date, end_date } = req.body;
  try {
    const result = await pool.query(
      `UPDATE academic_sessions SET name=$1, year=$2, start_date=$3, end_date=$4 
       WHERE id=$5 RETURNING *`,
      [name, year, start_date, end_date, req.params.id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Session not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
export async function deleteSession(req, res) {
  try {
    const result = await pool.query(
      `DELETE FROM academic_sessions WHERE session_id=$1 RETURNING *`,
      [req.params.id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Session not found" });
    res.json({ message: "Session deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
