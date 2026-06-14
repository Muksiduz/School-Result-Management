import pool from "../db/pool.js";

export async function getAllSections(req, res) {
    
      try {
        const result = await pool.query(
          `SELECT s.*, c.name as class_name 
       FROM sections s
       JOIN classes c ON s.class_id = c.class_id
       ORDER BY c.name, s.name`,
        );
        res.json(result.rows);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
   
}

export async function getSectionsByClass(req, res){
    try {
      const result = await pool.query(
        `SELECT * FROM sections WHERE class_id = $1 ORDER BY name`,
        [req.params.class_id],
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}


export async function createSection(req, res){
    const { name, class_id } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO sections (name, class_id) VALUES ($1, $2) RETURNING *`,
        [name, class_id],
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}


export async function updateSection(req, res){
    const { name } = req.body;
    try {
      const result = await pool.query(
        `UPDATE sections SET name=$1 WHERE section_id=$2 RETURNING *`,
        [name, req.params.id],
      );
      if (result.rows.length === 0)
        return res.status(404).json({ message: "Section not found" });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}

export async function deleteSection(req, res){
    try {
      const result = await pool.query(
        `DELETE FROM sections WHERE section_id=$1 RETURNING *`,
        [req.params.id],
      );
      if (result.rows.length === 0)
        return res.status(404).json({ message: "Section not found" });
      res.json({ message: "Section deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}