const express = require("express")
const router = express.Router()

// const verifyCreate = require("../../"s)

const adminUserController = require("../../controllers/admin/user")
const { verifyCreate, verifyUser, verifyIsNotAdmin } = require("../../middlewares/admin/user")

router.post("/user", verifyCreate , adminUserController.create)
router.delete("/user/:id", [verifyUser , verifyIsNotAdmin] ,adminUserController.delete)

module.exports = router