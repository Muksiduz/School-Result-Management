import pool from "../db/pool.js";

export async function getAllSubjects(req, res){
    try {
        const result = await pool.query(`SELECT * FROM subjects ORDER BY subject_id ASC`);
        res.status(200).json({ message: "Subjects fetched successfully", subjects: result.rows });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getSubjectsByClass(req, res) {
  const { class_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM subjects WHERE class_id = $1 ORDER BY name`,
      [class_id],
    );

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createSubject(req, res){
    const {name, class_id} = req.body;
    if(!name || !class_id){
        return res.status(400).json({ message: "Subject name and class id are required" });
    }
    try {
        const result = await pool.query(`INSERT INTO subjects (name, class_id) VALUES ($1, $2) RETURNING *`, [name, class_id]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function updateSubject(req, res){
    const {id} = req.params;
    const {name, class_id} = req.body;
    if(!name || !class_id){
        return res.status(400).json({ message: "Subject name and class id are required" });
    }
    try {
        const result = await pool.query(`UPDATE subjects SET name = $1, class_id = $2 WHERE subject_id = $3 RETURNING *`, [name, class_id, id]);
        if(result.rowCount === 0){
            return res.status(404).json({ message: "Subject not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function deleteSubject(req, res){
    const {id} = req.params;
    try {
        const result = await pool.query(`DELETE FROM subjects WHERE subject_id = $1 RETURNING *`, [id]);
        if(result.rowCount === 0){
            return res.status(404).json({ message: "Subject not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}