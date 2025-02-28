import Job from "../models/job.js";
import Employer from "../models/employer.js";
import sequelize from "../config/database.js";
import { Op } from "sequelize";

// **1. Create a Job Posting**
export const createJob = async (req, res) => {
    try {
        const { title, description, location, salary } = req.body;
        const employer_id = req.user.id; // Extract employer ID from authenticated user

        // Check if the employer exists
        const employer = await Employer.findByPk(employer_id);
        if (!employer) {
            return res.status(404).json({ message: "Employer not found" });
        }

        // Create a new job
        const job = await Job.create({ title, description, location, salary, employer_id });

        res.status(201).json({ message: "Job posted successfully", job });
    } catch (error) {
        console.error("Error in createJob:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// **2. Get All Jobs**
// export const getAllJobs = async (req, res) => {
//     try {
//         const jobs = await Job.findAll({
//             include: [{ model: Employer, attributes: ["company_name", "location"] }],
//         });

//         res.status(200).json(jobs);
//     } catch (error) {
//         console.error("Error in getAllJobs:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };

// Get all jobs (with pagination)
export const getAllJobs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const jobs = await Job.findAndCountAll({
            include: [{ model: Employer, attributes: ["company_name", "location"] }],
            limit,
            offset,
            order: [['posted_at', 'DESC']] // Assuming you want the newest jobs first
        });

        res.status(200).json({
            jobs: jobs.rows,
            totalJobs: jobs.count,
            totalPages: Math.ceil(jobs.count / limit),
            currentPage: page
        });
    } catch (error) {
        console.error("Error in getAllJobs:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// **3. Get Job by ID**
export const getJobById = async (req, res) => {
    try {
        const { job_id } = req.params;

        const job = await Job.findByPk(job_id, {
            include: [{ model: Employer, attributes: ["company_name", "location"] }],
        });

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.status(200).json(job);
    } catch (error) {
        console.error("Error in getJobById:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// **4. Update Job Listing (Employer Only)**
export const updateJob = async (req, res) => {
    try {
        const { job_id } = req.params;
        const employer_id = req.user.id; // Extract employer ID from token
        const { title, description, location, salary } = req.body;

        // Find job
        const job = await Job.findOne({ where: { job_id, employer_id } });

        if (!job) {
            return res.status(404).json({ message: "Job not found or unauthorized" });
        }

        // Update job details
        await job.update({ title, description, location, salary });

        res.status(200).json({ message: "Job updated successfully", job });
    } catch (error) {
        console.error("Error in updateJob:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// **5. Delete Job (Employer Only)**
export const deleteJob = async (req, res) => {
    try {
        const { job_id } = req.params;
        const employer_id = req.user.id; // Extract employer ID from token

        const job = await Job.findOne({ where: { job_id, employer_id } });

        if (!job) {
            return res.status(404).json({ message: "Job not found or unauthorized" });
        }

        await job.destroy();

        res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        console.error("Error in deleteJob:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//Get all jobs (with optional search by title)
export const getJobsByName = async (req, res) => {
    try {
        const { title } = req.query; // Get title from query params

        // Debugging logs
        console.log("Received search title:", title);

        // Default: Get all jobs
        let whereClause = {};
        if (title) {
            whereClause.title = { [Op.like]: `%${title}%` }; // Case-insensitive search (for MySQL)
        }

        console.log("Where clause:", whereClause); // Log the filter condition

        // Fetch jobs based on filter
        const jobs = await Job.findAll({ where: {
            title: sequelize.where(
                sequelize.fn("LOWER", sequelize.col("title")),
                "LIKE",
                `%${title.toLowerCase()}%`
            ),
        },
    });

        console.log("Found jobs:", jobs.length); // Log the number of results

        if (jobs.length === 0) {
            return res.status(404).json({ message: "No jobs found" });
        }

        res.status(200).json(jobs);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

