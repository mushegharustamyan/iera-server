const { validationResult } = require("express-validator");
const { User, Role } = require("../../db/sequelize");
const { sendResStatus, sendResBody } = require("../../utils/helpers");

exports.verifyCreate = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(409).json({ error: error.array() });
  }

  const { name, login, password, roleId } = req.body;

  if (!name || !login || !password || !roleId) return sendResStatus(res, 400);

  User.findOne({ where: { login } })
    .then((user) => {
      if (user) return sendResStatus(res, 409);

      next();
    })
    .catch((_) => sendResStatus(res,500));
};

exports.verifyUser = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(409).json({ error: error.array() });
  }

  const { id } = req.params;
  User.findByPk(id).then((user) => {
    if (!user) return sendResStatus(res, 404);

    next();
  });
};

exports.verifyIsNotAdmin = (req, res, next) => {
  const { id } = req.params;

  User.findByPk(id).then((user) => {
    Role.findByPk(user.roleId).then((role) => {
      if (role.access_level === 1) return sendResStatus(res, 403);

      next();
    });
  });
};

