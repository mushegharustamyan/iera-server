const { Request, Post } = require("../db/sequelize");
const { sendResBody, sendResStatus } = require("../utils/helpers");

exports.index = (req, res) => {
  Request.findAll()
    .then((result) => sendResBody(res, 200, result))
    .catch((_) => sendResStatus(res, 500));
};

exports.show = (req, res) => {
  const { id } = req.params;
  Post.findByPk(id)
    .then((result) => sendResBody(res, 200, result))
    .catch((result) => sendResStatus(res, 500));
};

exports.approve = (req, res) => {
  const { id } = req.params;

  Post.update({ status: "approved" }, { where: { id } })
    .then((_) => {
      Request.destroy({ where: { postId: id } })
        .then((_) => sendResStatus(res, 203,"Post Approved"))
        .catch((_) => sendResStatus(res, 500));
    })
    .catch((_) => sendResStatus(res, 500));
};

exports.decline = (req, res) => {
  const { id } = req.params;

  Post.update({ status: "rejected" }, { where: { id } })
    .then((_) => {
      Request.destroy({ where: { postId: id } }).then((_) =>
        sendResStatus(res, 203) 
      );
    })
    .catch((_) => sendResStatus(res, 500));
};
