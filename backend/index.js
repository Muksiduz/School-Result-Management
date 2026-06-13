import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import initDb from "./db/initDB.js";
import path from "node:path";
import { fileURLToPath } from 'node:url';
import { seedAdmin } from './db/seedAdmin.js';
import authRouter from './routes/auth.route.js';
import classesRouter from './routes/classes.route.js';
import sectionsRouter from './routes/sections.route.js';

const app = express();

await initDb();
await seedAdmin();

const _filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(_filename);
console.log(__dirname);
console.log(_filename);
console.log(import.meta.url);

app.use(express.json());
app.use(cors());

app.get("/api/v1/health", (req, res) => {
  res.send("School Result Management System is RUNNING");
});

// AUTH Routes
app.use("/api/v1/auth", authRouter);

// CLASSES Routes
app.use("/api/v1/classes", classesRouter);

// SECTIONS Routes
app.use('/api/v1/sections', sectionsRouter);




// STATIC FILES
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});




const PORT = process.env.PORT || 5000;

app.listen(PORT,"0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}
      URL: http://localhost:${PORT}
      `);
})
