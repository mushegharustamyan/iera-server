const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../db/sequelize");
const { sendResStatus, getEnv, sendResBody } = require("../utils/helpers");

exports.signin = (req, res) => {
  const { login, password } = req.body;
  User.findOne({
    where: {
      login,
    },
  })
    .then(async (user) => {
      if (!user) {
        return sendResStatus(res, 409, "Invalid Login or Password");
      }
      const decoded = await bcrypt.compare(password, user.password);
      if (!decoded) {
        return sendResStatus(res, 409, "Invalid Login or Password");
      }
      const token = jwt.sign(
        { id: user.id, name: user.name, roleId: user.roleId },
        getEnv("JWT_SECRET"),
        {
          expiresIn: 80000,
        }
      );

      return sendResBody(res, 200, { token });
    })
    .catch((_) => sendResStatus(res, 500, "Internal Server Error"));
};
