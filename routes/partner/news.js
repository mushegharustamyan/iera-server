const express = require("express");
const router = express.Router();

const newsController = require("../../controllers/partner/news")

const {verifyPost, verifyCreate} = require("../../middlewares/admin/news")
const {verifyOwn} = require("../../middlewares/partners/news")
const {verifyPartner} = require("../../middlewares/verifications")

router.get("/" , newsController.index)
router.get("/:id", [verifyPost , verifyOwn] , newsController.show)
router.delete("/:id", [verifyPost , verifyOwn] , newsController.delete)
router.put("/:id" , [verifyPost , verifyOwn] , newsController.update)
router.post("/", verifyCreate , newsController.create)

module.exports = router