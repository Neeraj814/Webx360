import { Application, Job, Company, User } from "../models/index.js";

// 1. Student applies for a job
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({ message: "Job id is required.", success: false });
        }

        // 🟢 MySQL Change: Check if already applied using 'where'
        const existingApplication = await Application.findOne({ 
            where: { jobId: jobId, applicantId: userId } 
        });

        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job", success: false });
        }

        // 🟢 MySQL Change: check if job exists
        const job = await Job.findByPk(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found", success: false });
        }

        await Application.create({
            jobId: jobId,
            applicantId: userId,
        });

        return res.status(201).json({ message: "Job applied successfully.", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// 2. Student: Get all jobs they applied for
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        
        // 🟢 MySQL Change: Deep Nesting with 'include'
        const applications = await Application.findAll({
            where: { applicantId: userId },
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: Job,
                    as: 'job',
                    include: [
                        { model: Company, as: 'company' }
                    ]
                }
            ]
        });

        if (!applications || applications.length === 0) {
            return res.status(200).json({ application: [], success: true });
        }

        return res.status(200).json({ application: applications, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// 3. Admin: See who applied for a specific job
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        
        // 🟢 MySQL Change: Get the job and include all its applicants
        const job = await Job.findByPk(jobId, {
            include: {
                model: Application,
                as: 'applications',
                include: {
                    model: User,
                    as: 'applicant',
                    attributes: ['fullname', 'email', 'phoneNumber', 'profilePhoto', 'bio', 'skills']
                }
            },
            order: [[ { model: Application, as: 'applications' }, 'createdAt', 'DESC' ]]
        });
        
        if (!job) {
            return res.status(404).json({ message: 'Job not found.', success: false });
        }

        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// 4. Admin: Update application status (Shortlist/Reject)
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({ message: 'Status is required', success: false });
        }

        const application = await Application.findByPk(applicationId);
        
        if (!application) {
            return res.status(404).json({ message: "Application not found.", success: false });
        }

        // Update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({ message: "Status updated successfully.", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}
