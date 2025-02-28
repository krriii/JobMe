import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// router.post("/register", (req, res) => {
//     res.send("User registered");
//   });
  
//   router.post("/login", (req, res) => {
//     res.send("User logged in");
//   });
// Route to display the registration form
router.get("/register", (req, res) => {
    res.render("auth/register");  // This will render register.ejs
});

router.post("/register", registerUser);

router.get("/login", (req, res) => {
    res.render("auth/login");  // This will render login.ejs
});

router.post("/login", loginUser);

export default router;
