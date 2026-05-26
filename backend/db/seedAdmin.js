import pool from "./pool.js";
import bcrypt from 'bcrypt'


export async function seedAdmin(){
    try {
        const isAdminExist =await pool.query(`SELECT * FROM users WHERE role = $1`,["admin"]);
        if(isAdminExist.rows.length > 0){
            console.log("Admin already exists");
            return;
        }

        const hashPassword = await bcrypt.hash("Let-me-in-123",10);

        const createAdmin = await pool.query(`INSERT INTO users(name,username,role,password) VALUES ($1, $2, $3, $4)`,
            ["Administrator","MasterAdmin","admin",hashPassword]
        ) 

        console.log("Admin created successfully");

    } catch (error) {
        console.log("Error:",error);
    }
}