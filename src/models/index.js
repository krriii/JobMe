import sequelize from "../config/database.js";
import User from "./user.js";
import Employer from "./employer.js";
import JobSeeker from "./jobSeeker.js";
import Job from "./job.js";
import Application from "./application.js";

// Sync all models
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    await sequelize.sync({ alter: true }); // Set `force: true` for full reset
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

export { sequelize, User, Employer, JobSeeker, Job, Application, syncDatabase };
