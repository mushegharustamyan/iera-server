const express = require("express");
const router = express.Router();

const eventController = require("../controllers/event")()

const {verifyPost, verifyCreate} = require("../middlewares/news");
const { verifyDecline } = require("../middlewares/verifications");

router.get("/" , eventController.index)
router.get("/:id", verifyPost , eventController.show)
router.delete("/:id", verifyPost , eventController.delete)
router.put("/:id" , verifyPost , eventController.update)
router.post("/", verifyCreate , eventController.create)
router.put("/approve/:id" , verifyPost ,eventController.approve)
router.put("/decline/:id", [verifyPost , verifyDecline] ,eventController.decline)

module.exports = router