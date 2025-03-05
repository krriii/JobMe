import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authController.js";
import { authenticateEmployer, authenticateJobSeeker } from "../middlewares/authMiddlewares.js";
import JobSeeker from "../models/jobSeeker.js";
import Employer from "../models/employer.js";
import {getApplicationsForEmployer} from "../controllers/applicationController.js";

const router = express.Router();

// Route to display the registration form
router.get("/register", (req, res) => {
    res.render("auth/register");  // This will render register.ejs
});

router.post("/register", registerUser);

router.get("/login", (req, res) => {
    res.render("auth/login");  // This will render login.ejs
});

// router.post("/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await loginUser(email, password);
//         if (user) {
//             req.session.user = {
//                 user_id: user.user_id,
//                 user_type: user.user_type,
//                 job_seeker_id: user.user_type === 'Job Seeker' ? user.job_seeker_id : null
//             };
//             // if (user.user_type === "Job Seeker") {
//             //     req.session.user.job_seeker_id = user.user_id; // Add job_seeker_id to session
//             // }
//             console.log('Session set for user:', req.session.user); // Log session user
//             const redirectUrl = user.user_type === "Employer" ? "/api/auth/dashboard/employer" : "/api/auth/dashboard/jobseeker";
//             res.json({ redirect: redirectUrl });
//         } else {
//             res.status(401).json({ message: "Invalid email or password" });
//         }
//     } catch (error) {
//         console.error("Login Error:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });
// router.post("/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await loginUser(email, password);
        
//         if (user) {
//             // If the user is a job seeker, fetch the job_seeker_id
//             let job_seeker_id = null;
//             if (user.user_type === "Job Seeker") {
//                 const jobSeeker = await JobSeeker.findOne({ where: { user_id: user.user_id } });
//                 job_seeker_id = jobSeeker ? jobSeeker.job_seeker_id : null;
//             }

//             // Set the session user data
//             req.session.user = {
//                 user_id: user.user_id,
//                 user_type: user.user_type,
//                 job_seeker_id: job_seeker_id  // Set the correct job_seeker_id here
//             };

//             console.log('Session set for user:', req.session.user);

//             // Redirect based on user type
//             const redirectUrl = user.user_type === "Employer" ? "/api/auth/dashboard/employer" : "/api/auth/dashboard/jobseeker";
//             res.json({ redirect: redirectUrl });
//         } else {
//             res.status(401).json({ message: "Invalid email or password" });
//         }
//     } catch (error) {
//         console.error("Login Error:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });

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


// router.get('/dashboard/employer/application-list', authenticateEmployer, async (req, res) => {
//     try {
//         // Fetch applications for the logged-in employer
//         const applications = await getApplicationsForEmployer(req, res);

//         // Render the application list page and pass applications data
//         res.render('employer/application-list', { user: req.user, applications });
//     } catch (error) {
//         console.error("Error rendering application list page:", error);
//         res.status(500).send("Error loading application list page");
//     }
// });

router.get('/dashboard/employer/application-list', authenticateEmployer, async (req, res) => {
    try {
        const result = await getApplicationsForEmployer(req);
        console.log("Applications Fetched:", result.application); 
        if (result.error) {
            return res.status(result.status).json({ message: result.error });
        }
        res.render('employer/application-list', { user: req.user, application: result.application });
    } catch (error) {
        console.error("Error rendering application list page:", error);
        res.status(500).send("Error loading application list page");
    }
});




export default router;
