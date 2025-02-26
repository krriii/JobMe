import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();


//database configuration
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT,
      logging: false,
    }
  );
  
//database connection
sequelize
  .authenticate()
  .then(() => console.log("The database connected"))
  .catch((err) => console.error("Database connection error ", err));

export default sequelize;

