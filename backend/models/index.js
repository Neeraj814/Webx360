import User from './user.model.js';
import Company from './company.model.js';
import Job from './job.model.js';
import Application from './application.model.js';

// 1. A Company can have many Jobs
Company.hasMany(Job, { foreignKey: 'companyId', as: 'jobs' });
Job.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

// 2. A User (Recruiter) creates a Job
User.hasMany(Job, { foreignKey: 'created_by', as: 'postedJobs' });
Job.belongsTo(User, { foreignKey: 'created_by', as: 'recruiter' });

// 3. Application Connections (The Junction)
Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications' });
Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

User.hasMany(Application, { foreignKey: 'applicantId', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'applicantId', as: 'applicant' });

export {
    User,
    Company,
    Job,
    Application
};