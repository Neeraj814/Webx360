import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/db.js';

const Company = sequelize.define('Company', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT
    },
    website: {
        type: DataTypes.STRING,
        validate: { isUrl: true }
    },
    location: {
        type: DataTypes.STRING
    },
    logo: {
        type: DataTypes.STRING // Cloudinary URL
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false // The Recruiter who registered this company
    }
}, {
    timestamps: true
});

export default Company;