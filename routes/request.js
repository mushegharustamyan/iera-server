const express = require("express");
const router = express.Router();

const requestController = require("../controllers/request");

router.get("/:id", requestController.show);
router.get("/", requestController.index);
router.put("/approve/:id", requestController.approve);
router.put("/decline/:id", requestController.decline);

module.exports = router;
