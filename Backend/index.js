import express from "express";
import dotenv from "dotenv";
import dbconnection from "./src/db/dbconnection.js";
import auth from "./src/routes/Auth.js"
import dashboard from "./src/routes/DashBoard.js"
import folder from "./src/routes/Folder.js"
import update from './src/routes/Update.js'
import typebot from "./src/routes/TypeBot.js"
import cors from "cors";


dotenv.config({
    path:'./.env'
});

const app = express();
const PORT = process.env.PORT || 5000;

dbconnection()

// Middleware
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Basic Route
app.get("/api/v1", (req, res) => {
  res.send("Welcome to the backend API!");
});

//auth
app.use('/api/v1/auth',auth)

//dashboard
app.use('/api/v1/dashboard',dashboard)

//folders
app.use('/api/v1/folder',folder)

//update userdetails
app.use('/api/v1/update',update)

//typeBot
app.use('/api/v1/typebot',typebot)



// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 Route
app.use((req, res) => {
  res.status(404).json({ error: "Route not found!" });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
