const express = require("express");
const router = express.Router();

const newsController = require("../../controllers/partner/news")()

const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB file size limit
  },
});

const {verifyPost, verifyCreate} = require("../../middlewares/news")
const {verifyOwn} = require("../../middlewares/partners/news")

router.get("/" , newsController.index)
router.get("/:id", [verifyPost , verifyOwn] , newsController.show)
router.put("/:id" ,upload.single('img') ,[verifyPost , verifyOwn] , newsController.update)
router.post("/", upload.single('img'),verifyCreate , newsController.create)

module.exports = router