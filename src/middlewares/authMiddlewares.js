import User from "../models/user.js";

// **General Authentication Middleware (For Any User)**
export const authenticateUser = (req, res, next) => {
    if (req.session.user) {
        req.user = req.session.user; // Store user info in request object
        next();
    } else {
        res.status(401).json({ message: "Unauthorized: Please log in" });
    }
};

// **Employer Authentication Middleware**
export const authenticateEmployer = (req, res, next) => {
    authenticateUser(req, res, () => {
        if (req.user.user_type !== "Employer") {
            return res.status(403).json({ message: "Access denied: Employers only" });
        }
        next();
    });
};

// **Job Seeker Authentication Middleware**
export const authenticateJobSeeker = (req, res, next) => {
    authenticateUser(req, res, () => {
        if (req.user.user_type !== "Job Seeker") {
            return res.status(403).json({ message: "Access denied: Job Seekers only" });
        }
        next();
    });
};
