const express = require("express");
const router = express.Router();

const adminNewsControllers = require("../../controllers/admin/news")

const {verifyPost, verifyCreate} = require("../../middlewares/admin/news")

router.get("/" , adminNewsControllers.index)
router.get("/:id", verifyPost , adminNewsControllers.show)
router.delete("/:id", verifyPost , adminNewsControllers.delete)
router.put("/:id" , verifyPost , adminNewsControllers.update)
router.post("/", verifyCreate , adminNewsControllers.create)

module.exports = router