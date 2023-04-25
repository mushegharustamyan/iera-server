const express = require("express");
const router = express.Router();

const postController = require("../controllers/posts")

router.get("/f",postController.filter)
router.get("/q", postController.show)
router.get("/" , postController.index)


module.exports = router