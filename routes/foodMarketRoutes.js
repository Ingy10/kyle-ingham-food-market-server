import express from "express";
import * as compareController from "../controllers/compare-controller.js";
import * as listController from "../controllers/list-controller.js";

const router = express.Router();

// Compare page routes
router
  .route("/compare/:userId/:province")
  .get(compareController.getAllProvincialCpiItems);

//List page routes
router
  .route("/grocery-list/:userId/:province/:groceryListId")
  .post(listController.addItemToList)
  .delete(listController.deleteItems)
  .get(listController.getListItems)
  .patch(listController.activeState);

router
  .route("/grocery-list/:userId/:province/:groceryListId/reset")
  .patch(listController.resetList);

router
  .route("/grocery-list/:userId/:province/:groceryListId/buy")
  .post(listController.addUserItem);

export default router;
