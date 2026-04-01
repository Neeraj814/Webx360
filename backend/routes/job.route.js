import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob, deleteJob } from "../controllers/job.controller.js";

const router = express.Router();

// 1. Keep protected (Only logged-in recruiters can post)
router.route("/post").post(isAuthenticated, postJob);

// 2. MAKE PUBLIC (This removes the 401 error for the home/jobs page)
router.route("/get").get(getAllJobs); 

// 3. Keep protected (Only the admin/recruiter should see their own dashboard jobs)
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);

// 4. MAKE PUBLIC (So users can click on a job to see details without logging in)
router.route("/get/:id").get(getJobById); 

router.route("/delete/:id").delete(isAuthenticated, deleteJob);

export default router;