import express from "express";
import {
    createJobSeeker,
    getJobSeekers,
    getJobSeekerById,
    updateJobSeeker,
    deleteJobSeeker,
    renderDashboard,
    renderApplications
} from "../controllers/jobSeekerController.js";
import { createApplication } from "../controllers/applicationController.js";
import { authenticateUser, authenticateJobSeeker } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.post("/", createJobSeeker);
router.get("/", getJobSeekers);
router.get("/:id", getJobSeekerById);
router.put("/:id", updateJobSeeker);
router.delete("/:id", deleteJobSeeker);
router.get("/dashboard", renderDashboard);
router.get("/applications", renderApplications); // Add this route to render the application statuses page
router.post("/applications", createApplication); // Add this route to handle job applications


export default router;


