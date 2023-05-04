const {Post , Request} = require("../db/sequelize");
const { sendResStatus } = require("../utils/helpers");

exports.approve = (req, res) => {
    const { id } = req.params;

    Post.update({ status: "approved" }, { where: { id } })
      .then((_) => {
        Request.destroy({where: {postId: id}})
        .then(_ => sendResStatus(res, 203))
        .catch((_) => sendResStatus(res, 500));
      })
      .catch((_) => sendResStatus(res, 500));
  };

exports.decline = (req, res) => {
    const { id } = req.params;
    const { requestId } = req.query;
    // const { reason } = req.body;

    Post.update({ status: "rejected" }, { where: { id } })
      .then((_) => sendResStatus(res,201))
      .catch((_) => sendResStatus(res, 500));
  };