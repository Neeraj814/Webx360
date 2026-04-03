import { Company, Job } from "../models/index.js";
import { sequelize } from "../utils/db.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// 1. REGISTER COMPANY
export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({ message: "Company name is required.", success: false });
        }

        // 🟢 MySQL Change: use 'where'
        let company = await Company.findOne({ where: { name: companyName } });
        if (company) {
            return res.status(400).json({ message: "You can't register the same company.", success: false });
        };

        company = await Company.create({
            name: companyName,
            userId: req.id // The Recruiter's ID from auth middleware
        });

        return res.status(201).json({ message: "Company registered successfully.", company, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// 2. GET COMPANIES BY LOGGED-IN USER (With Job Count)
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; 

        // 🟢 Pro SQL Move: Get companies and count jobs in ONE query
        const companies = await Company.findAll({
            where: { userId },
            attributes: {
                include: [
                    [sequelize.fn("COUNT", sequelize.col("jobs.id")), "jobCount"]
                ]
            },
            include: [{
                model: Job,
                as: 'jobs',
                attributes: [] // Don't fetch job data, just count them
            }],
            group: ['Company.id']
        });
        
        if (!companies || companies.length === 0) {
            return res.status(404).json({ message: "No companies found.", success: false });
        }

        return res.status(200).json({ companies, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// 3. GET ALL COMPANIES (Public List)
export const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.findAll({
            attributes: {
                include: [[sequelize.fn("COUNT", sequelize.col("jobs.id")), "jobCount"]]
            },
            include: [{ model: Job, as: 'jobs', attributes: [] }],
            group: ['Company.id']
        });

        return res.status(200).json({ companies: companies || [], success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// 4. GET COMPANY BY ID
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        
        // 🟢 MySQL Change: findByPk
        const company = await Company.findByPk(companyId, {
            attributes: {
                include: [[sequelize.fn("COUNT", sequelize.col("jobs.id")), "jobCount"]]
            },
            include: [{ model: Job, as: 'jobs', attributes: [] }],
            group: ['Company.id']
        });
        
        if (!company) {
            return res.status(404).json({ message: "Company not found.", success: false });
        }

        return res.status(200).json({ company, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// 5. UPDATE COMPANY
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const file = req.file; 
        
        let logo;
        if (file) {
            // Cloudinary logic
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logo = cloudResponse.secure_url;
        }

        const updateData = { name, description, website, location };
        if(logo) updateData.logo = logo;

        // 🟢 MySQL Update using Sequelize
        // Sequelize update returns an array [affectedCount]
        const [affectedCount] = await Company.update(updateData, {
            where: {
                id: req.params.id 
            }
        });

        // Agar affectedCount 0 hai, matlab ID nahi mili
        if (affectedCount === 0) {
            return res.status(404).json({
                message: "Company not found or no changes made.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company information updated.",
            success: true
        });

    } catch (error) {
        console.error("SQL Error Details:", error); // Terminal check karein
        return res.status(500).json({ 
            message: "Internal Server Error", 
            error: error.message, // Debugging ke liye error message bhej rahe hain
            success: false 
        });
    }
}
}
