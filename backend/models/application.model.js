import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/db.js';

const Application = sequelize.define('Application', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
        defaultValue: 'pending'
    },
    // Foreign Keys will be handled by Associations: jobId and applicantId
}, {
    timestamps: true
});

export default Application;