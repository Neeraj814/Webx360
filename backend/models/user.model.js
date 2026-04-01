import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/db.js'; // Ensure this points to your Sequelize connection

const User = sequelize.define('User', {
    // 1. Primary Identity
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    phoneNumber: {
        type: DataTypes.BIGINT, // Use BIGINT for 10-digit Indian numbers
        allowNull: false,
        validate: {
            len: [10, 15]
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('student', 'recruiter'),
        allowNull: false
    },

    // 2. Flattened Profile Data (Professional Way)
    bio: {
        type: DataTypes.TEXT
    },
    skills: {
        type: DataTypes.TEXT, // Store as comma-separated string or JSON.stringify()
        get() {
            const rawValue = this.getDataValue('skills');
            return rawValue ? rawValue.split(',') : [];
        },
        set(val) {
            this.setDataValue('skills', Array.isArray(val) ? val.join(',') : val);
        }
    },
    resume: {
        type: DataTypes.STRING // URL to S3/Cloudinary
    },
    resumeOriginalName: {
        type: DataTypes.STRING
    },
    profilePhoto: {
        type: DataTypes.STRING,
        defaultValue: ""
    }
    // Note: 'company' relationship will be defined via "Associations" later
}, {
    timestamps: true // Automatically creates createdAt and updatedAt
});

export default User;