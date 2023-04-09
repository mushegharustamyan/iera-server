const express = require("express");
const router = express.Router();

const adminNewsControllers = require("../../controllers/admin/news")

router.get("/" , adminNewsControllers.index)

module.exports = router