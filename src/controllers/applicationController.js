import Application from "../models/application.js";
import Job from "../models/job.js";
import JobSeeker from "../models/jobSeeker.js";

// Create a new application
export const createApplication = async (req, res) => {
    try {
        const { job_id, job_seeker_id } = req.body;

        const newApplication = await Application.create({
            job_id,
            job_seeker_id,
        });

        res.status(201).json(newApplication);
    } catch (error) {
        console.error("Error creating application:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get all applications
export const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.findAll({
            include: [Job, JobSeeker],
        });

        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get application by ID
export const getApplicationById = async (req, res) => {
    try {
        const { id } = req.params;

        const application = await Application.findByPk(id, {
            include: [Job, JobSeeker],
        });

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.status(200).json(application);
    } catch (error) {
        console.error("Error fetching application:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const application = await Application.findByPk(id);

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        application.status = status;
        await application.save();

        res.status(200).json(application);
    } catch (error) {
        console.error("Error updating application status:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete application
export const deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;

        const application = await Application.findByPk(id);

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        await application.destroy();

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting application:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};