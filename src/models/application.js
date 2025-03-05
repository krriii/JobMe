import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Job from "./job.js";
import JobSeeker from "./jobSeeker.js";

const Application = sequelize.define(
  "Application",
  {
    application_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    job_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    job_seeker_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    resume_file: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Accepted", "Rejected"),
      defaultValue: "Pending",
    },
    applied_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "Applications",
  }
);

// Define associations
Application.belongsTo(Job, { foreignKey: "job_id", onDelete: "CASCADE" });
Application.belongsTo(JobSeeker, { foreignKey: "job_seeker_id", onDelete: "CASCADE" });


export default Application;
