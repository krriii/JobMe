import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authController.js";
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
        const { email, password } = req.body;
        const user = await loginUser(email, password);
        if (user) {
            req.session.user = {
                user_id: user.user_id,
                user_type: user.user_type,
                job_seeker_id: user.user_id
            };
            // if (user.user_type === "Job Seeker") {
            //     req.session.user.job_seeker_id = user.user_id; // Add job_seeker_id to session
            // }
            console.log('Session set for user:', req.session.user); // Log session user
            const redirectUrl = user.user_type === "Employer" ? "/api/auth/dashboard/employer" : "/api/auth/dashboard/jobseeker";
            res.json({ redirect: redirectUrl });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/logout", logoutUser);

router.get('/dashboard/employer', authenticateEmployer, (req, res) => {
    res.render('employer/dashboard', { user: req.user }); // Render employer dashboard
});

router.get('/dashboard/jobseeker', authenticateJobSeeker, (req, res) => {
    res.render('jobseeker/dashboard', { user: req.user, job_seeker_id: req.session.user.job_seeker_id }); // Render job seeker dashboard
});

export default router;
