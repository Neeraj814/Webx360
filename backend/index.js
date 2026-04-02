import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./utils/db.js"; 
import "./models/index.js"; 

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

// 🟢 FIX: CORS Configuration for Production
const corsOptions = {
    origin: [
        'https://webx360-6u95ht3v6-neeraj814s-projects.vercel.app', // Jo error mein origin dikh raha hai
        'http://localhost:5173'
    ],
    credentials: true, // Cookies allow karne ke liye
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // OPTIONS zaroori hai pre-flight ke liye
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to MySQL has been established successfully. 🚀');
        
        // Use { alter: true } only in development. 
        // Production mein sync carefully use karein.
        await sequelize.sync({ alter: true }); 
        console.log("All MySQL models were synchronized successfully. ✅");
        
        console.log(`Server running at port ${PORT} ✅`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
