import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_type: {
      type: DataTypes.ENUM("Employer", "Job Seeker", "Admin"),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "Users",
    indexes: [
      {
          unique: true,
          fields: ['email']
      },
    ]
  }
);

export default User;
