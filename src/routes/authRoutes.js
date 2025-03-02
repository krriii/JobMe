import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { authenticateEmployer, authenticateJobSeeker } from "../middlewares/authMiddlewares.js";

const router = express.Router();

// Route to display the registration form
router.get("/register", (req, res) => {
    res.render("auth/register");  // This will render register.ejs
});

router.post("/register", registerUser);

router.get("/login", (req, res) => {
    res.render("auth/login");  // This will render login.ejs
});

router.post("/login", async (req, res) => {
    try {
        const user = await loginUser(req.body.email, req.body.password);
        if (user) {
            req.session.user = user;
            console.log('Session set for user:', req.session.user); // Log session user
            res.json({ redirect: user.user_type === "Employer" ? "/api/auth/dashboard/employer" : "/api/auth/dashboard/jobseeker" });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout failed" });
        }
        res.redirect("/login");
    });
});

router.get('/dashboard/employer', authenticateEmployer, (req, res) => {
    res.render('employer/dashboard', { user: req.user }); // Render employer dashboard
});

router.get('/dashboard/jobseeker', authenticateJobSeeker, (req, res) => {
    res.render('jobseeker/dashboard', { user: req.user }); // Render job seeker dashboard
});

export default router;
