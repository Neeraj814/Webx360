import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// 1. Load environment variables
dotenv.config();

// 2. Debug Log for Render
console.log("Checking DATABASE_URL in Environment:", process.env.DATABASE_URL ? "FOUND ✅" : "NOT FOUND ❌");

/**
 * 🟢 Aiven MySQL Cloud Configuration
 */
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false // Required for Aiven Cloud MySQL
        }
    },
    logging: false, // Keeps logs clean in production
}); // <--- Syntax fixed: Added missing closing parenthesis here

const connectDB = async () => {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL is missing in Render Environment Settings!");
        }
        
        await sequelize.authenticate();
        console.log('Ji Babuji, MySQL Connected Successfully! 🚀');
    } catch (error) {
        console.error('MySQL Connection Error:', error.message);
        if (error.name === 'SequelizeConnectionRefusedError') {
            console.error('Tip: Check if IP 0.0.0.0/0 is allowed in Aiven console.');
        }
    }
};

export default connectDB;
export { sequelize };
