const express = require("express");
const router = express.Router();

const postController = require("../controllers/posts")

router.get("/:id", postController.show)
router.get("/" , postController.index)
router.get("/q", postController.filter)

module.exports = router
