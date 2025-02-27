import express from "express";
import {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getJobsByName

} from "../controllers/jobController.js";
import { authenticateEmployer, authenticateUser } from "../middlewares/authMiddlewares.js";

const router = express.Router();

// **1. Create Job (Only Employer)**
router.post("/", authenticateEmployer, createJob);

// **2. Get All Jobs (Public)**
router.get("/", getAllJobs);

// **3. Get Job by ID (Public)**
router.get("/:job_id", getJobById);

// **4. Update Job (Only Employer)**
router.put("/:job_id", authenticateEmployer, updateJob);

// **5. Delete Job (Only Employer)**
router.delete("/:job_id", authenticateEmployer, deleteJob);

router.get("/search", getJobsByName); // Route for searching jobs by title


export default router;
