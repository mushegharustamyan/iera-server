const express = require("express");
const router = express.Router();
const { Subscribe } = require("../db/sequelize");

const subscribeController = require("../controllers/subscribe");
const { sendResStatus } = require("../utils/helpers");

router.post(
  "/:id",
  (req, res, next) => {
    const { email } = req.body;
    Subscribe.findAll({ where: { email } }).then((email) => {
      if (email) return sendResStatus(res,409);
    });
    next()
  },
  subscribeController.create
);
router.get("/", subscribeController.index);

module.exports = router;
