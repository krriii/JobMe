import JobSeeker from "../models/jobSeeker.js";
import User from "../models/user.js";

// Create JobSeeker
export const createJobSeeker = async (req, res) => {
    try {
        const jobSeeker = await JobSeeker.create(req.body);
        res.status(201).json(jobSeeker);
    } catch (error) {
        console.error("Error creating job seeker:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get all JobSeekers
export const getJobSeekers = async (req, res) => {
    try {
        const jobSeekers = await JobSeeker.findAll();
        res.status(200).json(jobSeekers);
    } catch (error) {
        console.error("Error fetching job seekers:", error);
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
        console.error("Error fetching job seeker:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update JobSeeker
export const updateJobSeeker = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await JobSeeker.update(req.body, {
            where: { job_seeker_id: id }
        });
        if (!updated) {
            return res.status(404).json({ message: "JobSeeker not found" });
        }
        const updatedJobSeeker = await JobSeeker.findByPk(id);
        res.status(200).json(updatedJobSeeker);
    } catch (error) {
        console.error("Error updating job seeker:", error);
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

// Render Dashboard
export const renderDashboard = async (req, res) => {
    try {
        const jobSeekerId = req.session.user.job_seeker_id; // Use job_seeker_id from session
        res.render('jobseeker/dashboard', { jobSeekerId });
    } catch (error) {
        console.error("Error rendering dashboard:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Render Applications
export const renderApplications = async (req, res) => {
    try {
        const jobSeekerId = req.session.user.job_seeker_id; // Use job_seeker_id from session
        res.render('jobseeker/application', { jobSeekerId });
    } catch (error) {
        console.error('Error rendering applications:', error);
        res.status(500).send('Internal Server Error');
    }
};
