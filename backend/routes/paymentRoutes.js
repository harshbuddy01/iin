import express from "express";
import { 
  checkout, 
  paymentVerification, 
  getApiKey 
} from "../controllers/paymentController.js";

const router = express.Router();

// Define the API paths
router.route("/getkey").get(getApiKey);
router.route("/checkout").post(checkout);
router.route("/paymentverification").post(paymentVerification);

export default router;