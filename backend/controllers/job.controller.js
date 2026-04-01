import { Job, Company, Application } from "../models/index.js";
import { Op } from "sequelize";

// 1. Admin posts a new job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId, jobWebsite, category } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId || !category) {
            return res.status(400).json({ message: "Something is missing.", success: false });
        }

        const job = await Job.create({
            title,
            description,
            requirements, // Setter in model handles string conversion
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            companyId, // MySQL uses the foreign key column name
            created_by: userId,
            jobWebsite: jobWebsite || "",
            category
        });

        return res.status(201).json({ message: "New job created successfully.", job, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// 2. Student: Get all jobs (Search by Title, Description, or Category)
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        
        // 🟢 MySQL Logic: Use Op.like for searching
        const jobs = await Job.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${keyword}%` } },
                    { description: { [Op.like]: `%${keyword}%` } },
                    { category: { [Op.like]: `%${keyword}%` } },
                ]
            },
            include: [{ model: Company, as: 'company' }], // 🟢 Replaces .populate()
            order: [['createdAt', 'DESC']] // 🟢 Replaces .sort()
        });

        return res.status(200).json({ jobs: jobs || [], success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// 3. Get single job details
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        
        // 🟢 MySQL Logic: Include multiple tables
        const job = await Job.findByPk(jobId, {
            include: [
                { model: Company, as: 'company' },
                { model: Application, as: 'applications' }
            ]
        });

        if (!job) {
            return res.status(404).json({ message: "Job not found.", success: false });
        }
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// 4. Admin: Get all jobs created by a specific admin
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.findAll({
            where: { created_by: adminId },
            include: [{ model: Company, as: 'company' }],
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({ jobs: jobs || [], success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// 5. Admin: Delete job
export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id; 

        const job = await Job.findByPk(jobId);

        if (!job) {
            return res.status(404).json({ message: "Job not found.", success: false });
        }

        // Security check
        if (job.created_by !== userId) {
            return res.status(403).json({ message: "Unauthorized.", success: false });
        }

        await job.destroy(); // 🟢 MySQL way to delete

        return res.status(200).json({ message: "Job deleted successfully.", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};