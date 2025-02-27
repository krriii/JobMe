import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// router.post("/register", (req, res) => {
//     res.send("User registered");
//   });
  
//   router.post("/login", (req, res) => {
//     res.send("User logged in");
//   });

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
