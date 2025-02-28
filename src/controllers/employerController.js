import Employer from "../models/employer.js";
import User from "../models/user.js";

// Create Employer
export const createEmployer = async (req, res) => {
    try {
        const { user_id, company_name, industry, location, website } = req.body;
    

        // Check if user exists and is an Employer
        const user = await User.findByPk(user_id);
        if (!user || user.user_type !== "Employer") {
            return res.status(400).json({ message: "Invalid user or not an Employer" });
        }

        const employer = await Employer.create({ employer_id: user_id, company_name, industry, location, website });

        res.status(201).json({ message: "Employer profile created successfully", employer });
    } catch (error) {
        console.error("Error in createEmployer:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get all Employers
export const getEmployers = async (req, res) => {
    try {
        const employers = await Employer.findAll();
        res.status(200).json(employers);
    } catch (error) {
        console.error("Error in getEmployers:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get Employer by ID
export const getEmployerById = async (req, res) => {
    try {
        const { id } = req.params;
        const employer = await Employer.findByPk(id);
        if (!employer) {
            return res.status(404).json({ message: "Employer not found" });
        }
        res.status(200).json(employer);
    } catch (error) {
        console.error("Error in getEmployerById:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update Employer
export const updateEmployer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, company_name, industry, location, website } = req.body;

        const employer = await Employer.findByPk(id);
        if (!employer) {
            return res.status(404).json({ message: "Employer not found" });
        }

        //await employer.update({ company_name, industry, location, website });

         // Update User table (name, email)
         await User.update(
            { name, email }, 
            { where: { user_id: id } } // user_id is same as employer_id
        );

        // Update Employer table (company details)
        await Employer.update(
            { company_name, industry, location, website }, 
            { where: { employer_id: id } }
        );

        res.status(200).json({ message: "Employer updated successfully", employer });
    } catch (error) {
        console.error("Error in updateEmployer:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete Employer
export const deleteEmployer = async (req, res) => {
    try {
        const { id } = req.params;
        const employer = await Employer.findByPk(id);
        if (!employer) {
            return res.status(404).json({ message: "Employer not found" });
        }

          // Delete the user associated with this employer
          await User.destroy({ where: { user_id: id } });

        res.status(200).json({ message: "Employer deleted successfully" });
    } catch (error) {
        console.error("Error in deleteEmployer:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
