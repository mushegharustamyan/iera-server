const { User } = require("../db/sequelize");
const { sendResBody, sendResStatus } = require("../utils/helpers");

exports.show = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, { attributes: ["name", "img"] });
    if (!user) {
      return sendResStatus(res, 404);
    }

    return sendResBody(res, 200, user);
  } catch (error) {
    return sendResStatus(res, 500);
  }
};
