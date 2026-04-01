import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/db.js';

const Job = sequelize.define('Job', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT, // Using TEXT for longer job descriptions
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    requirements: {
        type: DataTypes.TEXT,
        get() {
            const val = this.getDataValue('requirements');
            return val ? val.split(',') : [];
        },
        set(val) {
            this.setDataValue('requirements', Array.isArray(val) ? val.join(',') : val);
        }
    },
    salary: {
        type: DataTypes.DECIMAL(15, 2), // Professional way to handle currency/LPA
        allowNull: false
    },
    experienceLevel: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    jobType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    position: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    jobWebsite: {
        type: DataTypes.STRING,
        defaultValue: "",
        validate: {
            isUrl: true // Built-in Sequelize validation
        }
    }
    // Note: 'company', 'created_by', and 'applications' are handled by Associations
}, {
    timestamps: true
});

export default Job; 