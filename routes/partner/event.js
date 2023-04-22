const express = require("express");
const router = express.Router();

const eventController = require("../../controllers/partner/news")

const {verifyPost, verifyCreate} = require("../../middlewares/event")
const {verifyOwn} = require("../../middlewares/partners/event")

router.get("/" , eventController.index)
router.get("/:id", [verifyPost , verifyOwn] , eventController.show)
router.delete("/:id", [verifyPost , verifyOwn] , eventController.delete)
router.put("/:id" , [verifyPost , verifyOwn] , eventController.update)
router.post("/", verifyCreate , eventController.create)

module.exports = router