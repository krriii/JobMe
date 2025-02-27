import express from "express";
import {
    createJobSeeker,
    getJobSeekers,
    getJobSeekerById,
    updateJobSeeker,
    deleteJobSeeker,
    
} from "../controllers/jobSeekerController.js";

const router = express.Router();

router.post("/", createJobSeeker);
router.get("/", getJobSeekers);
router.get("/:id", getJobSeekerById);
router.put("/:id", updateJobSeeker);
router.delete("/:id", deleteJobSeeker);


export default router;


