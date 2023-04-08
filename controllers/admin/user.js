const bcrypt = require("bcrypt");
const { User } = require("../../db/sequelize");

const { sendResStatus, sendResBody } = require("../../utils/helpers");

exports.create = async (req, res) => {
  const { name, password, login, roleId } = req.body;

  const hashedPwd = await bcrypt.hash(password, 8);

  User.create({
    name,
    password: hashedPwd,
    login,
    roleId,
  })
    .then((_) => sendResStatus(res, 201, "User Created"))
    .catch((_) => sendResStatus(res, 500));
};

exports.delete = (req, res) => {
  const { id } = req.params;

  User.destroy({ where: { id } })
    .then((_) => sendResStatus(res, 204))
    .catch((_) => sendResStatus(res, 500));
};

const removeNullOrUndefined = (obj) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { name, password, login, roleId } = req.body;
  const filter = removeNullOrUndefined({
    name,
    password,
    login,
    password,
    roleId,
  });
  console.log(filter);
  User.findOne({ where: filter })
    .then((user) => {
      if (user) return sendResStatus(res, 409), "User already exist";
    })
    .then((_) => {
      User.update(filter, {
        where: { id },
      })
        .then((_) => sendResStatus(res, 201, "Record updated"))
        .then((_) => sendResStatus(res, 500));
    });
};

exports.index = (req, res) => {
  User.findAll()
    .then((result) => sendResBody(res, 200, result))
    .catch((_) => sendResStatus(res, 500));
};

exports.show = (req, res) => {
  const { id } = req.params;

  User.findByPk(id)
    .then((result) => sendResBody(res, 200, result))
    .catch((_) => sendResStatus(res, 500));
};
