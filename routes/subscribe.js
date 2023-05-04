const express = require("express");
const router = express.Router();
const { Subscribe } = require("../db/sequelize");

const {verifyAdmin} = require("../middlewares/verifications")

const subscribeController = require("../controllers/subscribe");
const { sendResStatus } = require("../utils/helpers");

router.post(
  "/subscribe",
  (req, res, next) => {
    const email = req.body.email;
    Subscribe.findAll({ where: { email } }).then(({email}) => {
      if (email) return sendResStatus(res,409);
    });
    next()
  },
  subscribeController.create
);
router.get("/admin/subscribers",verifyAdmin , subscribeController.index);
router.delete("/admin/subscribers/:id", (req,res, next)=> {
  const {id} = req.params

  Subscribe.findAll({where: id}).then(subscribe => {
    if(!subscribe) return sendResStatus(res,404)
  })
  next()
}, subscribeController.delete)

module.exports = router;
