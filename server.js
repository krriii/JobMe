import express from 'express';
import path from 'path';
import dotenv from "dotenv";
import { syncDatabase } from "./src/models/index.js";
import { fileURLToPath } from 'url';
import authRoutes from "./src/routes/authRoutes.js";

dotenv.config();

// Create an express server
const server = express();


// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
server.use(express.json()); // To handle JSON requests
server.use(express.urlencoded({ extended: true })); // To handle form data
server.use(express.static(path.join(__dirname, "public"))); // Static files

// Set up view engine
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

// Sync Database
(async () => {
    try {
        await syncDatabase();
        console.log("Database synced successfully!");
    } catch (error) {
        console.error("Database sync failed:", error);
    }
})();

server.use("/api/auth", authRoutes);


server.get("/", (req, res) => {
    res.send("JobMe is running...");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
