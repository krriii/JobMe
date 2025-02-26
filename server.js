import express from 'express';
import path from 'path';
import dotenv from "dotenv";
import { syncDatabase } from "./src/models/index.js";
import { fileURLToPath } from 'url';

dotenv.config();

// Create an express server
const server = express();

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set up view engine
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

syncDatabase();

server.get("/", (req, res) => {
    res.send("JobMe API is running...");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
