const express = require("express");
const router = express.Router();


const approveDeclineController = require("../controllers/approve-decline")

router.put("/request/approve/:id" ,approveDeclineController.approve)
router.put("/request/decline/:id", approveDeclineController.decline)

module.exports = router