import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./user.js";


const JobSeeker = sequelize.define(
  "JobSeeker",
  {
    job_seeker_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    skills: {
      type: DataTypes.TEXT,
    },
    experience: {
      type: DataTypes.TEXT,
    },
    portfolio_link: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
    tableName: "JobSeekers",
  }
);

// Define association (1-to-1 with User)
JobSeeker.belongsTo(User, { foreignKey: "job_seeker_id", onDelete: "CASCADE" });



export default JobSeeker;
