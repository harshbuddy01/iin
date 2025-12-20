import express from "express";
import { 
  adminLogin, 
  uploadQuestion, 
  deleteQuestion, 
  getResults 
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/admin-login", adminLogin);
router.post("/upload-question", uploadQuestion);
router.delete("/admin/delete-question/:id", deleteQuestion);
router.get("/admin/results", getResults);

export default router;