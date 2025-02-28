import express from "express";
import {
    createApplication,
    getAllApplications,
    getApplicationById,
    updateApplicationStatus,
    deleteApplication,
} from "../controllers/applicationController.js";

const router = express.Router();

// Create a new application
router.post("/", createApplication);

// Get all applications
router.get("/", getAllApplications);

// Get application by ID
router.get("/:id", getApplicationById);

// Update application status
router.put("/:id/status", updateApplicationStatus);

// Delete application
router.delete("/:id", deleteApplication);

export default router;