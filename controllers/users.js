const {User} = require("../db/sequelize")
const { sendResBody, sendResStatus } = require("../utils/helpers")

exports.show = async (req, res) => {
    try {
      const {authorId} = req.body;
      const user = await User.findByPk(authorId, { attributes: ["name", "img"] });
      if (!user) {
        return sendResStatus(res, 404);
      }
      return sendResBody(res, 200, user);
    } catch (error) {
      return sendResStatus(res, 500);
    }
  };