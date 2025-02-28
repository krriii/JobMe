import express from "express";
import { createEmployer, getEmployers, getEmployerById, updateEmployer, deleteEmployer } from "../controllers/employerController.js";


const router = express.Router();

router.post("/", createEmployer); // Create an employer
router.get("/", getEmployers); // Get all employers
router.get("/:id", getEmployerById); // Get a specific employer
router.put("/:id", updateEmployer); // Update an employer
router.delete("/:id", deleteEmployer); // Delete an employer



export default router;

