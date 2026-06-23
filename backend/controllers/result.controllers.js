import pool from "../db/pool.js";

export async function insertResult(req, res) {
    const {
      student_id,
      class_id,
      section_id,
      session_id,
      unit_test_id,
      marks,
    } = req.body;
    // marks = [{ subject_id: 1, marks_obtained: 85 }, ...]

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      for (const mark of marks) {
        await client.query(
          `INSERT INTO results (student_id, class_id, section_id, session_id, unit_test_id, subject_id, marks_obtained)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            student_id,
            class_id,
            section_id,
            session_id,
            unit_test_id,
            mark.subject_id,
            mark.marks_obtained,
          ],
        );
      }
      await client.query("COMMIT");
      res.status(201).json({ message: "Results saved" });
    } catch (err) {
      await client.query("ROLLBACK");
      res.status(500).json({ message: err.message });
    } finally {
      client.release();
    }

}


export async function getStudentBySessionClassAndSection(req, res) {
    const { session_id, class_id, section_id } = req.query;
    try {
      const result = await pool.query(
        `SELECT DISTINCT s.student_id, s.name, s.roll_no 
       FROM results r
       JOIN students s ON r.student_id = s.student_id
       WHERE r.session_id=$1 AND r.class_id=$2 AND r.section_id=$3`,
        [session_id, class_id, section_id],
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}

export async function getUnitTest(req, res){
    const { student_id, session_id } = req.query;
    try {
      const result = await pool.query(
        `SELECT DISTINCT ut.test_id, ut.name, ut.max_marks
       FROM results r
       JOIN unit_tests ut ON r.unit_test_id = ut.test_id
       WHERE r.student_id=$1 AND r.session_id=$2`,
        [student_id, session_id],
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ message: err.message });
      console.log(err);
    }
}

export async function getResultOfSingleStudent(req, res) {
    const { student_id, session_id, unit_test_id, class_id, section_id } = req.query;
    try {
      const result = await pool.query(
        `SELECT r.student_id, st.name as student_name,st.roll_no,st.father_name, r.marks_obtained,s.subject_id, s.name as subject_name, ut.max_marks, ut.name as test_name, c.class_id, c.name as class_name, sec.section_id, sec.name as section_name, ses.session_id, ses.name as session_name
       FROM results r
       JOIN subjects s ON r.subject_id = s.subject_id
       JOIN unit_tests ut ON r.unit_test_id = ut.test_id
       JOIN students st ON r.student_id = st.student_id
       JOIN classes c ON r.class_id = c.class_id
       JOIN sections sec ON r.section_id = sec.section_id
       JOIN academic_sessions ses ON r.session_id = ses.session_id
       WHERE r.student_id=$1 AND r.session_id=$2 AND r.unit_test_id=$3 AND r.class_id=$4 AND r.section_id=$5`,
        [student_id, session_id, unit_test_id, class_id, section_id],
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ message: err.message });
      console.log(err);
    }
}


export async function getClassResult(req, res) {
    const { session_id, class_id, section_id, test_id } = req.query;
    try {
      const result = await pool.query(
        `SELECT s.student_id ,s.name as student_name,s.roll_no as roll_Number, sub.name as subject_name, 
              r.marks_obtained, ut.name as test_name, ut.max_marks
       FROM results r
       JOIN students s ON r.student_id = s.student_id
       JOIN subjects sub ON r.subject_id = sub.subject_id
       JOIN unit_tests ut ON r.unit_test_id = ut.test_id
       WHERE r.session_id=$1 AND r.class_id=$2 AND r.section_id=$3 AND r.unit_test_id=$4
       ORDER BY s.name, ut.name, sub.name`,
        [session_id, class_id, section_id, test_id],
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ message: err.message });
      console.log(err)
    }
}


export async function oneStudentAllSubjects(req, res){
    try {
      const {
        student_id,
        class_id,
        section_id,
        session_id,
        unit_test_id,
        results,
      } = req.body;

      if (!results || results.length === 0) {
        return res.status(400).json({
          message: "Results array is required",
        });
      }

      const insertedResults = [];

      for (const result of results) {
        const response = await pool.query(
          `INSERT INTO results
        (
          student_id,
          class_id,
          section_id,
          session_id,
          unit_test_id,
          subject_id,
          marks_obtained
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING *`,
          [
            student_id,
            class_id,
            section_id,
            session_id,
            unit_test_id,
            result.subject_id,
            result.marks_obtained,
          ],
        );

        insertedResults.push(response.rows[0]);
      }

      res.status(201).json(insertedResults);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Failed to add results",
      });
    }
}

export async function oneSubjectAllStudents(req, res){
   
      try {
        const {
          class_id,
          section_id,
          session_id,
          unit_test_id,
          subject_id,
          results,
        } = req.body;

        if (!results || results.length === 0) {
          return res.status(400).json({
            message: "Results array is required",
          });
        }

        const insertedResults = [];

        for (const result of results) {
          const response = await pool.query(
            `INSERT INTO results
        (
          student_id,
          class_id,
          section_id,
          session_id,
          unit_test_id,
          subject_id,
          marks_obtained
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING *`,
            [
              result.student_id,
              class_id,
              section_id,
              session_id,
              unit_test_id,
              subject_id,
              result.marks_obtained,
            ],
          );

          insertedResults.push(response.rows[0]);
        }

        res.status(201).json(insertedResults);
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: "Failed to add results",
        });
      }
    };


export async function insertResultOneSubjectAllStudents(req, res) {
      const {
        session_id,
        class_id,
        section_id,
        unit_test_id,
        subject_id,
        marks,
      } = req.body;
      // marks = [{ student_id: 1, marks_obtained: 85 }, ...]

      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        for (const mark of marks) {
          await client.query(
            `INSERT INTO results (student_id, class_id, section_id, session_id, unit_test_id, subject_id, marks_obtained)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (student_id, unit_test_id, subject_id)
         DO UPDATE SET marks_obtained = EXCLUDED.marks_obtained
         `,
            [
              mark.student_id,
              class_id,
              section_id,
              session_id,
              unit_test_id,
              subject_id,
              mark.marks_obtained,
            ],
          );
        }
        await client.query("COMMIT");
        res.status(201).json({ message: "Marks saved successfully" });
      } catch (err) {
        await client.query("ROLLBACK");
        res.status(500).json({ message: err.message });
        console.log(err);
      } finally {
        client.release();
      }
}    

