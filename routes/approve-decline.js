const express = require("express");
const router = express.Router();


const approveDeclineController = require("../controllers/approve-decline")()

router.put("/approve/:id" ,approveDeclineController.approve)
router.put("/decline/:id", approveDeclineController.decline)

module.exports = router