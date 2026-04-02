// backend/utils/db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// 1. Load dotenv at the very top
dotenv.config();

// 2. Debug Log: Ye Render ke logs mein dikhayega ki variable mila ya nahi
console.log("Checking DATABASE_URL in Environment:", process.env.DATABASE_URL ? "FOUND ✅" : "NOT FOUND ❌");

/**
 * 🟢 Aiven MySQL Cloud Configuration
 * Hum 'DATABASE_URL' variable ka use kar rahe hain.
 * Fallback: Agar undefined hua toh empty string denge taaki error clear aaye.
 */
const sequelize = new Sequelize(process.env.DATABASE_URL || "", {
    dialect: 'mysql',
    logging: false, 
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false 
        },
        connectTimeout: 60000 
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const connectDB = async () => {
    try {
        // Validation check before attempting connection
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL is missing in Render Environment Settings!");
        }
        
        await sequelize.authenticate();
        console.log('Ji Babuji, MySQL Connected Successfully! 🚀');
    } catch (error) {
        console.error('MySQL Connection Error:', error.message);
        if (error.name === 'SequelizeConnectionRefusedError') {
            console.error('Tip: Check karein ki Aiven mein IP 0.0.0.0/0 allowed hai ya nahi.');
        }
    }
};

export default connectDB;
export { sequelize };
