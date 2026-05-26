import pool from "../db/pool.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config()

export async function loginController(req, res){
    try {
       const {username,password} = req.body;
       if(!username || !password){
        return res.status(400).json({message:"All fields are required"});
       }

       const user = await pool.query(`SELECT id,name,username,role,password FROM users WHERE username = $1`,[username]);
       if(user.rows.length == 0){
        return res.status(404).json({message:"No user found"})
       }
       const checkPassword = await bcrypt.compare(password,user.rows[0].password);
       if(!checkPassword){
        return res.status(401).json({ message: "Wrong Credenctials" });
       }

       const token = await jwt.sign({
        id:user.rows[0].id,
        name:user.rows[0].name,
        username:user.rows[0].username,
        role:user.rows[0].role
       },
       process.env.JWT_SECRET,
       {
        expiresIn:"7d",
       }
       ) 

       res.status(200).json({
         message: "Login Successfull",
         token,
         user: {
           id: user.rows[0].id,
           name: user.rows[0].name,
           username: user.rows[0].username,
           role: user.rows[0].role,
         },
       });

    } catch (error) {
        console.log(error);
       res.status(500).json({"Error:":error.message}) 
    }
}