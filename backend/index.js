import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
// 🟢 Logic Change: Import Sequelize connection and your models index
import { sequelize } from "./utils/db.js"; 
import "./models/index.js"; // This ensures all associations/tables are loaded

import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    credentials: true
}
app.use(cors(corsOptions));

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
    try {
        // 🟢 Logic Change: Authenticate and Sync MySQL Tables
        await sequelize.authenticate();
        console.log('Connection to MySQL has been established successfully. 🚀');
        
        // Use { alter: true } to update tables without losing data during development
        await sequelize.sync({ alter: true }); 
        console.log("All MySQL models were synchronized successfully. ✅");
        
        console.log(`Server running at port ${PORT} ✅`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});