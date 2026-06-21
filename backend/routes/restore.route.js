import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// BACKUP
router.post("/backup", verifyToken, isAdmin, (req, res) => {
  const { db_password } = req.body;
  const backupPath = path.join(__dirname, "../backups/backup.dump");

  exec(
    `pg_dump -U postgres -d school_result_db -F c -f "${backupPath}"`,
    {
      env: { ...process.env, PGPASSWORD: db_password },
    },
    (err) => {
      if (err) return res.status(500).json({ message: "Backup failed" });
      res.download(backupPath, "school_backup.dump");
    },
  );
});
