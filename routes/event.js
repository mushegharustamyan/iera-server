const express = require("express");
const router = express.Router();

const eventController = require("../controllers/event")()

const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB file size limit
  },
});

const {verifyPost, verifyCreate} = require("../middlewares/event");
const { verifyDecline } = require("../middlewares/verifications");

router.get("/" , eventController.index)
router.get("/:id", verifyPost , eventController.show)
router.delete("/:id", verifyPost , eventController.delete)
router.put("/:id" ,upload.single('image'), verifyPost , eventController.update)
router.post("/",upload.single('image'), verifyCreate , eventController.create)


module.exports = router