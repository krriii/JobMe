import express from "express";
import {
    createApplication,
    getAllApplications,
    getApplicationById,
    updateApplicationStatus,
    deleteApplication,
    getApplicationsByJobSeeker,
    getApplicationsForEmployer,
    getApplicationsByJobSeekerId, checkIfAlreadyApplied
} from "../controllers/applicationController.js";
import multer from 'multer';

import { authenticateEmployer, authenticateJobSeeker } from "../middlewares/authMiddlewares.js";

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Create a new application
router.post("/apply", upload.single('resume'), createApplication);
router.get("/check", checkIfAlreadyApplied);

router.get("/jobseekers/:job_seeker_id", getApplicationsByJobSeeker);

// Get all applications
router.get("/", getAllApplications);

// Get application by ID
router.get("/:id", getApplicationById);

// Update application status
router.put("/:id/status", updateApplicationStatus);

// Delete application
router.delete("/:id", deleteApplication);

// **7. Get applications by job seeker ID**
router.get("/jobSeekerId/:job_seeker_id", authenticateJobSeeker, getApplicationsByJobSeekerId);

// **8. Get applications for employer (Employer only)**
router.get("/employer", authenticateEmployer, getApplicationsForEmployer); 

export default router;