// backend/utils/db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

/**
 * 🟢 Aiven MySQL Cloud Configuration
 * Hum 'DATABASE_URL' variable ka use kar rahe hain jo Render mein set hai.
 * Ismein host, user, password, aur port sab kuch ek hi link mein hota hai.
 */
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: false, // Console par SQL queries ko hide karne ke liye
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // 🔴 Aiven MySQL ke liye ye line compulsory hai
        },
        connectTimeout: 60000 // Cloud connection ke liye timeout (60 seconds)
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
        await sequelize.authenticate();
        console.log('Ji Babuji, MySQL Connected Successfully! 🚀');
    } catch (error) {
        console.error('MySQL Connection Error:', error);
        // Error details check karne ke liye:
        if (error.name === 'SequelizeConnectionRefusedError') {
            console.error('Tip: Check karein ki Aiven mein IP 0.0.0.0/0 allowed hai ya nahi.');
        }
    }
};

export default connectDB;
export { sequelize };
