import pool from "../db/pool.js";

export async function getAllClasses(req, res) {
  try {
    //changed the class_id to id
    const classes = await pool.query(`SELECT * FROM classes ORDER BY id ASC`);
    res
      .status(200)
      .json({ message: "Classes fetched successfully", classes: classes.rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
    console.log(error.message);
  }
}

export async function createClass(req, res) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Class name is required" });
  }
  try {
    const result = await pool.query(
      `INSERT INTO classes(name) VALUES ($1) RETURNING *`,
      [name],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateClass(req, res) {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Class name is required" });
  }
  try {
    const result = await pool.query(
      //changed the class_id to id
      `UPDATE classes SET name = $1 WHERE id = $2 RETURNING *`,
      [name, id],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteClass(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      //changed the class_id to id
      `DELETE FROM classes WHERE id = $1 RETURNING *`,
      [id],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
