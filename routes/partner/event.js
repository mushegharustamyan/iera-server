const express = require("express");
const router = express.Router();

const eventControllers = require("../../controllers/partner/event")()

const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB file size limit
  },
});

const {verifyPost, verifyCreate} = require("../../middlewares/event")
const {verifyOwn} = require("../../middlewares/partners/event")

router.get("/" , eventControllers.index)
router.get("/:id", [verifyPost , verifyOwn] , eventControllers.show)
router.put("/:id" , upload.single('img'),[verifyPost , verifyOwn] , eventControllers.update)
router.post("/",upload.single('img'), verifyCreate , eventControllers.create)

module.exports = router