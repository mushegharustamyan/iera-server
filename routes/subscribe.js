const express = require("express");
const router = express.Router();
const { Subscribe } = require("../db/sequelize");

const { verifyAdmin } = require("../middlewares/verifications");

const subscribeController = require("../controllers/subscribe");
const { sendResStatus } = require("../utils/helpers");

router.post("/subscribe", subscribeController.create);
router.get("/admin/subscribers", verifyAdmin, subscribeController.index);
router.delete(
  "/admin/subscribers/:id",
  verifyAdmin,
  subscribeController.delete
);
router.get(
  "/admin/subscribers/download",
  verifyAdmin,
  subscribeController.downloadAll
);
module.exports = router;
