import pool from "../db/pool.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function loginController(req, res) {
  try {
    console.log(req.body);
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await pool.query( 
      `SELECT user_id,name,username,role,password FROM users WHERE username = $1`,
      [username],
    );
    if (user.rows.length == 0) {
      return res.status(404).json({ message: "No user found" });
    }
    const checkPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!checkPassword) {
      return res.status(401).json({ message: "Wrong Credenctials" });
    }

    const token = await jwt.sign(
      {
        id: user.rows[0].user_id,
        name: user.rows[0].name,
        username: user.rows[0].username,
        role: user.rows[0].role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      message: "Login Successfull",
      token,
      user: {
        id: user.rows[0].user_id,
        name: user.rows[0].name,
        username: user.rows[0].username,
        role: user.rows[0].role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ "Error:": error.message });
  }
}

export async function createUserController(req, res) {
  try {
    const { name, username, password, role } = req.body;

    if (!name.trim() || !username.trim() || !password.trim() || !role.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await pool.query(
      `INSERT INTO users(name,username,password,role) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, username, hashedPassword, role],
    );
    res
      .status(201)
      .json({ message: "User created successfully", user: user.rows[0] });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ message: "Username already exists" });
    }
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getAllUserController(req, res) {
  try {
    const users = await pool.query(
      `SELECT user_id,name,username,role FROM users`,
    );
    res
      .status(200)
      .json({ message: "Users fetched successfully", users: users.rows });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

export async function updateUserController(req, res) {
  try {
    const { id } = req.params;
    const { name, username, role } = req.body;

    const updateUser = await pool.query(
      `UPDATE users SET name = $1, username = $2, role = $3 WHERE user_id = $4 RETURNING *`,
      [name, username, role, id],
    );

    if (updateUser.rows.length == 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: updateUser.rows[0] });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    res.status(500).json({
      message: "Server error",
    });
  }
}

export async function deleteUserController(req, res) {
  try {
    const { id } = req.params;

    const deleteUser = await pool.query(
      `DELETE FROM users WHERE user_id = $1 RETURNING *`,
      [id],
    );

    if (deleteUser.rows.length == 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User deleted successfully", user: deleteUser.rows[0] });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}
