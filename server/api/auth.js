const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
require("dotenv").config();

const router = express.Router();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

router.use(express.json());

router.post("/register", async (req, res) => {
  try {
    const { username, password, name } = req.body;
    pool.query(
      `SELECT * FROM user WHERE username = ?`,
      [username],
      async (error, results) => {
        if (error) {
          res.status(500).json({ message: error.message });
        } else {
          if (results.length > 0) {
            res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
          } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            pool.query(
              `INSERT INTO user (username, password, name) VALUES (?, ?, ?)`,
              [username, hashedPassword, name],
              (error, results) => {
                if (error) {
                  res.status(500).json({ message: error.message });
                } else {
                  res.status(200).json({ message: "Đăng ký thành công" });
                }
              }
            );
          }
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    pool.query(
      `SELECT * FROM user WHERE username = ?`,
      [name],
      async (error, results) => {
        if (error) {
          res.status(500).json({ message: error.message });
        } else {
          if (results.length > 0) {
            const user = results[0];
            const validPassword = await bcrypt.compare(password, user.password);
            if (validPassword) {
              res.status(200).json({ message: "Đăng nhập thành công" });
            } else {
              res
                .status(401)
                .json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
            }
          } else {
            res
              .status(401)
              .json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
          }
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
