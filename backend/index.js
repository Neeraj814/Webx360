import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB, { sequelize } from "./utils/db.js"; 
import "./models/index.js"; 

import userRoute from "./routes/user.route.js";
// Baaki routes bhi yahan import karein (company, job, etc.)

dotenv.config({});

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🟢 CORS Configuration for Webx360
const allowedOrigins = [
    'https://webx360.vercel.app',
    'https://webx360-hy88dmi4h-neeraj814s-projects.vercel.app',
    'http://localhost:5173'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS, Babuji!'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));

// API Routes
app.use("/api/v1/user", userRoute);
 app.use("/api/v1/company", companyRoute); 
 app.use("/api/v1/job", jobRoute);

// Fallback for undefined routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found, Babuji!", success: false });
});

const PORT = process.env.PORT || 8000;

// 🚀 SERVER START LOGIC
app.listen(PORT, async () => {
    try {
        // 1. Initialize Database Connection (Aiven MySQL)
        await connectDB();
        console.log('Connection to Aiven MySQL established. 🚀');

        // 2. Synchronize Models Safely
        // 🟢 FIX: { alter: true } ko hata diya hai production crash se bachne ke liye
        await sequelize.sync(); 
        console.log("All MySQL models synchronized successfully. ✅");

        console.log(`Server running at port ${PORT} ✅`);
    } catch (error) {
        console.error('Unable to start the server, Babuji:', error.message);
        process.exit(1); 
    }
});
