const express = require("express");
const router = express.Router();

const requestController = require("../controllers/request")

router.get("/:id", requestController.show)
router.get("/" , requestController.index)


module.exports = router