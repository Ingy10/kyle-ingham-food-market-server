import express from "express";
import * as compareController from "../controllers/compare-controller.js";
import * as listController from "../controllers/list-controller.js";

const router = express.Router();

// Compare page routes
router
  .route("/compare/:userId/:province")
  .get(compareController.getAllProvincialCpiItems);

export default router;
