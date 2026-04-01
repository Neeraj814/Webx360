// utils/db.js (MySQL Cloud-Ready Version)
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'job_portal_db', 
    process.env.DB_USER || 'root', 
    process.env.DB_PASSWORD || '', 
    {
        host: process.env.DB_HOST || 'localhost',
        // 🟢 Port zaroori hai cloud ke liye (e.g. 12345)
        port: process.env.DB_PORT || 3306, 
        dialect: 'mysql',
        logging: false, 
        dialectOptions: {
            // 🟢 Aiven aur cloud services ke liye SSL zaroori hai
            ssl: {
                rejectUnauthorized: false
            },
            connectTimeout: 60000 // Cloud connection ke liye timeout badha diya
        }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Ji Babuji, MySQL Connected Successfully! 🚀');
    } catch (error) {
        console.error('MySQL Connection Error:', error);
    }
};

export default connectDB;
export { sequelize };