import express from "express";
// Ensure all three functions are imported correctly
import { checkout, paymentVerification, getApiKey } from "../controllers/paymentController.js";

const router = express.Router();

router.route("/getkey").get(getApiKey);
router.route("/checkout").post(checkout);
router.route("/paymentverification").post(paymentVerification);

export default router;