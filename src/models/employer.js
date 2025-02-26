import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./user.js";

const Employer = sequelize.define(
  "Employer",
  {
    employer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    industry: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    website: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
    tableName: "Employers",
  }
);

// Define association (1-to-1 with User)
Employer.belongsTo(User, { foreignKey: "employer_id", onDelete: "CASCADE" });

export default Employer;
