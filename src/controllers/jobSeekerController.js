import JobSeeker from "../models/jobSeeker.js";
import User from "../models/user.js";

// Create JobSeeker
export const createJobSeeker = async (req, res) => {
    try {
        const { user_id, resume_file, skills, experience, portfolio_link } = req.body;

        // Check if user exists and is a JobSeeker
        const user = await User.findByPk(user_id);
        if (!user || user.user_type !== "Job Seeker") {
            return res.status(400).json({ message: "Invalid user or not a JobSeeker" });
        }

        const jobSeeker = await JobSeeker.create({ 
            job_seeker_id: user_id, 
            resume_file, 
            skills, 
            experience, 
            portfolio_link 
        });

        res.status(201).json({ message: "JobSeeker profile created successfully", jobSeeker });
    } catch (error) {
        console.error("Error in createJobSeeker:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get all JobSeekers
export const getJobSeekers = async (req, res) => {
    try {
        const jobSeekers = await JobSeeker.findAll();
        res.status(200).json(jobSeekers);
    } catch (error) {
        console.error("Error in getJobSeekers:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get JobSeeker by ID
export const getJobSeekerById = async (req, res) => {
    try {
        const { id } = req.params;
        const jobSeeker = await JobSeeker.findByPk(id);
        if (!jobSeeker) {
            return res.status(404).json({ message: "JobSeeker not found" });
        }
        res.status(200).json(jobSeeker);
    } catch (error) {
        console.error("Error in getJobSeekerById:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update JobSeeker
export const updateJobSeeker = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, resume_file, skills, experience, portfolio_link } = req.body;

        const jobSeeker = await JobSeeker.findByPk(id);
        if (!jobSeeker) {
            return res.status(404).json({ message: "JobSeeker not found" });
        }

        // Update User table (name, email)
        await User.update(
            { name, email }, 
            { where: { user_id: id } }
        );

        // Update JobSeeker table
        await JobSeeker.update(
            { resume_file, skills, experience, portfolio_link }, 
            { where: { job_seeker_id: id } }
        );

        res.status(200).json({ message: "JobSeeker updated successfully", jobSeeker });
    } catch (error) {
        console.error("Error in updateJobSeeker:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete JobSeeker
export const deleteJobSeeker = async (req, res) => {
    try {
        const { id } = req.params;
        const jobSeeker = await JobSeeker.findByPk(id);
        if (!jobSeeker) {
            return res.status(404).json({ message: "JobSeeker not found" });
        }

        // Delete the user associated with this job seeker
        await User.destroy({ where: { user_id: id } });

        res.status(200).json({ message: "JobSeeker deleted successfully" });
    } catch (error) {
        console.error("Error in deleteJobSeeker:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
