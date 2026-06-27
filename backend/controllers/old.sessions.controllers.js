import pool from "../db/pool.js";

export async function getAllOldSessions(req, res) {
  try {
    const response = await pool.query(
      `SELECT * FROM old_sessions ORDER BY year DESC`,
    );

    if (response.rows.length === 0) {
      return res.status(404).json({
        message: "No old sessions found",
      });
    }

    return res.json(response.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
}

export async function getSingleOldSessions(req, res) {
    try{
        const { id } = req.params;

        const response = await pool.query(
          `SELECT * FROM old_sessions WHERE old_session_id = $1`,
          [id],
        );

        if (response.rows.length === 0) {
          return res.status(404).json({
            message: "Old session not found",
          });
        }

        return res.json(response.rows[0]);
    }
    catch(error){
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}

export async function createOldSession(req, res) {
    const {name , year} = req.body;
    if (!name || !year) {
      return res.status(400).json({
        message: "Name and year are required",
      });
    }
    try {
        const response = await pool.query(`INSERT INTO old_sessions (name,year) VALUES ($1,$2) RETURNING *`,[name,year]);
        res.status(201).json(response.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}

export async function updateOldSession(req, res) {
    try {
        const {id} = req.params;
        const {name , year} = req.body;
        const response = await pool.query(`
            UPDATE old_sessions SET name = $1, year = $2 WHERE old_session_id = $3 RETURNING *`,
            [name,year,id]
        );
        if (response.rows.length === 0) {
          return res.status(404).json({ message: "Old session not found" });
        }
        res.json(response.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}

export async function deleteOldSession(req, res) {
    try {
       const { id } = req.params;
       const response = await pool.query(
         `DELETE FROM old_sessions WHERE old_session_id = $1 RETURNING *`,
         [id],
       );
       res.json(response.rows[0]); 
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}
