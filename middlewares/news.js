const { News } = require("../db/sequelize");
const { sendResStatus } = require("../utils/helpers");

exports.verifyPost = (req, res, next) => {
  const { id } = req.params;

  News.findByPk(id).then((post) => {
    if (!post) return sendResStatus(res, 404);

    next();
  });
};

exports.verifyCreate = (req, res, next) => {
  const { title, description, date} = req.body;

  if (!title || !description  || !date) return sendResStatus(res, 409);
  News.findOne({
    where: {
      title,
    },
  }).then((news) => {
    console.log(title,description)
    if (news) return sendResStatus(res, 409);
    next();
  });
};
