const express = require("express");
const router = express.Router();

const adminEventsController = require("../../controllers/admin/events");
const { verifyPost, verifyCreate } = require("../../middlewares/admin/events");

router.get("/", adminEventsController.index)
router.get("/:id",verifyPost, adminEventsController.show)
router.put("/:id", verifyPost, adminEventsController.update)
router.delete("/:id", verifyPost, adminEventsController.delete)
router.post("/", verifyCreate, adminEventsController.create)

module.exports = router