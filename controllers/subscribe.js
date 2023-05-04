const { where } = require("sequelize");
const { Subscribe } = require("../db/sequelize");
const { sendResStatus, sendResBody } = require("../utils/helpers");

exports.create = (req, res) => {
  const email = req.body.email;
  console.log(email);

  Subscribe.create({ email })
    .then((_) => sendResStatus(res, 201))
    .catch((e) => console.log(e));
};

exports.index = (req, res) => {
  Subscribe.findAll()
    .then((result) => sendResBody(res, 200, result))
    .catch((e) => console.log(e));
};

exports.delete = async (req, res) => {
  try {
    const { id } = await req.params;
    const count = await Subscribe.destroy({ where: { id } });
    if(count === 0){
        return sendResStatus(res,404)
    }
    sendResStatus(res,204)
  } catch (error) {
    sendResStatus(res,500)
  }
};
