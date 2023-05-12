const express = require("express");
const router = express.Router();

const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB file size limit
  },
});

const newsController = require("../controllers/news")()

const {verifyPost, verifyCreate} = require("../middlewares/news")

router.get("/" , newsController.index)
router.get("/:id", verifyPost , newsController.show)
router.delete("/:id", verifyPost , newsController.delete)
router.put("/:id" ,upload.single('img'), verifyPost , newsController.update)
router.post("/", upload.single('img'),verifyCreate , newsController.create)


module.exports = router