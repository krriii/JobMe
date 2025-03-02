import express from "express";
import { createEmployer, getEmployers, getEmployerById, updateEmployer, deleteEmployer, submitForm} from "../controllers/employerController.js";
//import { authenticateToken } from "../middlewares/authMiddlewares.js";
import { authenticateEmployer } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.post("/", createEmployer); // Create an employer
router.get("/", getEmployers); // Get all employers
router.get("/:id", getEmployerById); // Get a specific employer
router.put("/:id", updateEmployer); // Update an employer
router.delete("/:id", deleteEmployer); // Delete an employer

// Route to handle form submission
router.post('/submit-form', submitForm);


// Route to handle job creation
//router.post('/jobs/create', authenticateEmployer, createJob);

// router.get("/dashboard/employer", authenticateToken, (req, res) => {
//     res.render("employer/dashboard", { user: req.user }); // Pass user info to dashboard
// });


export default router;

