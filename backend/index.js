import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB, { sequelize } from "./utils/db.js"; 
import "./models/index.js"; 

import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🟢 CORS Configuration for Webx360
const allowedOrigins = [
    'https://webx360.vercel.app',
    'http://localhost:5173'
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps)
        if (!origin) return callback(null, true);
        
        // Match specific origins or any Vercel preview link
        const isAllowed = allowedOrigins.includes(origin) || origin.endsWith(".vercel.app");
        
        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS, Babuji!'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
};

app.use(cors(corsOptions));

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// Fallback for undefined routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found, Babuji!", success: false });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
    try {
        // Initialize Database Connection
        await connectDB();
        
        // Synchronize Models (Use { alter: true } carefully in production)
        await sequelize.sync({ alter: true }); 
        console.log("All MySQL models synchronized successfully. ✅");
        
        console.log(`Server running at port ${PORT} ✅`);
    } catch (error) {
        console.error('Unable to start the server:', error);
    }
});
