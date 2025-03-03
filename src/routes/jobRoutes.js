import express from "express";
import {
    createJob,
    getJobById,
    updateJob,
    deleteJob,
    getJobsByName,
    getJobs,
    getEmployerJobs
} from "../controllers/jobController.js";
import { authenticateEmployer, authenticateJobSeeker} from "../middlewares/authMiddlewares.js";

const router = express.Router();

// **1. Create Job (Only Employer)**
router.post("/create", authenticateEmployer, createJob);

// **2. Get All Jobs (Public)**
router.get("/", authenticateJobSeeker, getJobs);

// **3. Get Job by ID (Public)**
router.get("/:job_id", getJobById);

// **4. Update Job (Only Employer)**
router.put("/:job_id", authenticateEmployer, updateJob);

// **5. Delete Job (Only Employer)**
router.delete("/:job_id", authenticateEmployer, deleteJob);

// Route for searching jobs by title
router.get("/search", getJobsByName);

// **6. Get Jobs for Employer (Only Employer)**
router.get("/employer/jobs", authenticateEmployer, getEmployerJobs);


export default router;
