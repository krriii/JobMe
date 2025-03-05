import Application from "../models/application.js";
import Job from "../models/job.js";
import JobSeeker from "../models/jobSeeker.js";
import Employer from "../models/employer.js";
import User from "../models/user.js";
import { Op } from "sequelize";
import multer from 'multer';


// Create a new application for jobseeker
// export const createApplication = async (req, res) => {
//     upload.single('resume')(req, res, async (err) => {
//         if (err instanceof multer.MulterError) {
//             return res.status(500).json({ message: "File upload error" });
//         } else if (err) {
//             return res.status(500).json({ message: "Unknown error during file upload" });
//         }

//         try {
//             const { job_id } = req.body;
//             const job_seeker_id = req.session.user.user_id; // Assuming you store user ID in session
//             const resume_file = req.file ? req.file.path : null;

//             if (!resume_file) {
//                 return res.status(400).json({ message: "Resume file is required" });
//             }

//             const application = await Application.create({
//                 job_id,
//                 job_seeker_id,
//                 resume_file,
//                 status: "Pending",
//                 applied_at: new Date(),
//             });

//             res.status(201).json(application);
//         } catch (error) {
//             console.error("Error creating application:", error);
//             res.status(500).json({ message: "Internal Server Error" });
//         }
//     });
// };
export const createApplication = async (req, res) => {
    try {
        const { job_id } = req.body;
        const job_seeker_id = req.session.user.user_id; // Assuming you store user ID in session
        const resume_file = req.file ? req.file.path : null; // Multer stores file info in req.file

        if (!resume_file) {
            return res.status(400).json({ message: "Resume file is required" });
        }

        const application = await Application.create({
            job_id,
            job_seeker_id,
            resume_file,
            status: "Pending",
            applied_at: new Date(),
        });

        res.status(201).json(application);
    } catch (error) {
        console.error("Error creating application:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// Check if job seeker has already applied for a job for jobseeker
export const checkIfAlreadyApplied = async (req, res) => {
    try {
        const { job_seeker_id, job_id } = req.query;  // Get IDs from req.body

        const existingApplication = await Application.findOne({
            where: {
                job_seeker_id: job_seeker_id,
                job_id: job_id
            }
        });

        if (existingApplication) {
            return res.status(200).json({ alreadyApplied: true });
        } else {
            return res.status(200).json({ alreadyApplied: false });
        }
    } catch (error) {
        console.error("Error checking if already applied:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// export const checkIfAlreadyApplied = async (req, res) => {
//     const { job_id } = req.query;
//     const { job_seeker_id } = req.session.user.user_id; // Get the job_seeker_id from the session

//     try {
//         // Validate that job_seeker_id is present
//         if (!job_seeker_id || !job_id) {
//             return res.status(400).json({ message: "Missing required parameters" });
//         }

//         // Check if the job seeker has already applied for the job
//         const existingApplication = await Application.findOne({
//             where: {
//                 job_seeker_id,
//                 job_id
//             }
//         });

//         if (existingApplication) {
//             return res.status(200).json({ message: "You have already applied to this job." });
//         } else {
//             return res.status(404).json({ message: "No application found for this job and job seeker." });
//         }
//     } catch (error) {
//         console.error("Error checking application:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };



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
// export const updateApplicationStatus = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { status } = req.body;

//         const application = await Application.findByPk(id);

//         if (!application) {
//             return res.status(404).json({ message: "Application not found" });
//         }

//         application.status = status;
//         await application.save();

//         res.status(200).json(application);
//     } catch (error) {
//         console.error("Error updating application status:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };
// applicationController.js
// applicationController.js
export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`application id is ${id}`);
        const { status } = req.body;
        console.log(`status is ${status}`);

        const application = await Application.findByPk(id);

        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        application.status = status;
        await application.save();

        // Corrected: Send a success response with the updated application
        res.status(200).json({ success: true, message: "Application status updated successfully", application: application });

    } catch (error) {
        console.error("Error updating application status:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
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

// Get applications by job seeker
export const getApplicationsByJobSeeker = async (req, res) => {
    try {
        const { job_seeker_id } = req.params;
        const applications = await Application.findAll({
            where: { job_seeker_id },
            include: [{ model: Job }]
        });
        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get applications by job seeker ID
export const getApplicationsByJobSeekerId = async (req, res) => {
    try {
        const { job_seeker_id } = req.params;
        const applications = await Application.findAll({
            where: { job_seeker_id },
            include: [{ model: Job }]
        });
        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get applications for the logged-in employer
// export const getApplicationsForEmployer = async (req, res) => {
//     try {
//         const employer_id = req.session.user.user_id;

//         // Find all jobs posted by the employer
//         const jobs = await Job.findAll({
//             where: { employer_id },
//             attributes: ['job_id'], // Only need the job_id
//         });

//         if (!jobs || jobs.length === 0) {
//             return res.status(404).json({ message: "No jobs found for this employer" });
//         }

//         // Extract job IDs
//         const jobIds = jobs.map(job => job.job_id);

//         // Find all applications for those jobs
//         const applications = await Application.findAll({
//             where: {
//                 job_id: {
//                     [Op.in]: jobIds  // Use Sequelize's Op.in operator
//                 }
//             },
//             include: [
//                 {
//                     model: Job,
//                     include: [
//                         {
//                             model: Employer,  // Include Employer data for the Job
//                         }
//                     ]
//                 },
//                 {
//                     model: JobSeeker,
//                     attributes: ['job_seeker_id', 'skills', 'experience', 'portfolio_link'],
//                     include: [
//                         {
//                             model: User,
//                             attributes: ['name', 'email']
//                         }
//                     ]
//                 }
//             ],
//         });

//         if (!applications || applications.length === 0) {
//             return res.status(404).json({ message: "No applications found for this employer's jobs" });
//         }

//         res.status(200).json(applications);
//     } catch (error) {
//         console.error("Error fetching applications:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };

export const getApplicationsForEmployer = async (req) => {
    try {
        const employer_id = req.session.user.user_id;

        const jobs = await Job.findAll({
            where: { employer_id },
            attributes: ['job_id'],
        });

        if (!jobs || jobs.length === 0) {
            return { error: "No jobs found for this employer", status: 404 };
        }

        const jobIds = jobs.map(job => job.job_id);

        const application = await Application.findAll({
            where: {
                job_id: {
                    [Op.in]: jobIds
                }
            },
            include: [
                {
                    model: Job,
                    include: [{ model: Employer }]
                },
                {
                    model: JobSeeker,
                    attributes: ['job_seeker_id', 'skills', 'experience', 'portfolio_link'],
                    include: [{ model: User, attributes: ['name', 'email'] }]
                }
            ],
        });

        if (!application || application.length === 0) {
            return { error: "No applications found for this employer's jobs", status: 404 };
        }

        return { application };
    } catch (error) {
        console.error("Error fetching applications:", error);
        return { error: "Internal Server Error", status: 500 };
    }
};
