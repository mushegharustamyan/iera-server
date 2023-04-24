const express = require("express");
const router = express.Router();

const newsController = require("../controllers/news")()

const {verifyPost, verifyCreate} = require("../middlewares/news")

router.get("/" , newsController.index)
router.get("/:id", verifyPost , newsController.show)
router.delete("/:id", verifyPost , newsController.delete)
router.put("/:id" , verifyPost , newsController.update)
router.post("/", verifyCreate , newsController.create)
router.put("/approve/:id" , newsController.approve)
router.put("/decline/:id", newsController.decline)

module.exports = router