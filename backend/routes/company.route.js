import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { 
    getCompany, 
    getCompanyById, 
    registerCompany, 
    updateCompany, 
    getAllCompanies,
    deleteCompany
} from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// 1. Register a new company (Private)
router.route("/register").post(isAuthenticated, registerCompany);

// 2. NEW: Get ALL companies on the website (Public - for Navbar showcase)
// Shows Neeraj (4) + Amit (2) = 6 Total
router.route("/getall").get(getAllCompanies); 

// 3. Get companies belonging to the logged-in user (Private - for Admin Dashboard)
// Shows only Neeraj's 4
router.route("/get").get(isAuthenticated, getCompany);

// 4. Get a specific company by ID
router.route("/get/:id").get(isAuthenticated, getCompanyById);

// 5. Update company details
router.route("/update/:id").put(isAuthenticated, singleUpload, updateCompany);
//delete company
router.route("/delete/:id").delete(isAuthenticated, deleteCompany);

export default router;
