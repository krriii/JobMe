import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Employer from "./employer.js";

const Job = sequelize.define(
  "Job",
  {
    job_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    employer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
    },
    jobType: {
      type: DataTypes.STRING,
    },
    posted_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "Jobs",
  }
);

// Define association (Many-to-1 with Employer)
Job.belongsTo(Employer, { foreignKey: "employer_id", onDelete: "CASCADE" });

export default Job;
