const { Event } = require("../db/sequelize");
const { sendResStatus } = require("../utils/helpers");

exports.verifyPost = (req, res, next) => {
  const { id } = req.params;

  Event.findByPk(id).then((post) => {
    if (!post) return sendResStatus(res, 404);

    next();
  });
};

exports.verifyCreate = (req, res, next) => {
  const { title, description , startDate , endDate} = req.body;

  if (!title || !description || startDate || endDate) return sendResStatus(res, 409);
  Event.findOne({
    where: {
      title,
    },
  }).then((news) => {
    if (news) return sendResStatus(res, 409);
    next();
  });
};