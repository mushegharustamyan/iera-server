const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../../db/sequelize");
const {
  sendResStatus,
  sendResBody,
  removeNullOrUndefined,
  s3,
} = require("../../utils/helpers");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { JsonWebTokenError } = require("jsonwebtoken");

exports.create = async (req, res) => {
  const { name, password, login, roleId } = req.body;
  const hashedPwd = await bcrypt.hash(password, 8);
  const file = req?.file;

  try {
    let Location;
    if (file) {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      await s3.send(new PutObjectCommand(params));
      const url = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
      Location = url;
    }
    const user = await User.create({
      name,
      password: hashedPwd,
      login,
      roleId,
      img: Location,
    });
    sendResStatus(res, 201, "User Created");
  } catch (error) {
    return sendResStatus(res, 500);
  }
};
exports.delete = async (req, res) => {
  const { id } = req.params;
  const { token } = req.headers;

  try {
    if (+id === jwt.decode(token).id) return sendResStatus(res, 409, "Conflict");

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return sendResStatus(res, 404);
    }

    const imageUrl = user.img;
    if (imageUrl) {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageUrl.split("/").pop(),
      };
      await s3.send(new DeleteObjectCommand(params));
    }

    await User.destroy({ where: { id } });

    sendResStatus(res, 204);
  } catch (error) {
    sendResStatus(res, 500);
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, password, login, roleId } = req.body;
  const file = req.file;

  try {
    const user = await User.findOne({ where: { id } });
    if (user.name === name && user.login === login) {
      return sendResStatus(res, 409);
    }
    let uppassword = user.password;
    if (password) {
      const hashedPwd = await bcrypt.hash(password, 8);
      uppassword = hashedPwd;
    }
    let imageUrl = user.img;
    if (file) {
      const oldKey = imageUrl.split("/").pop();
      const deleteParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: oldKey,
      };
      await s3.send(new DeleteObjectCommand(deleteParams));

      const newKey = `${Date.now()}_${file.originalname}`;
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: newKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      await s3.send(new PutObjectCommand(newParams));
      const location = `https://${uploadParams.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
      imageUrl = location;
    }

    const body = removeNullOrUndefined({
      name,
      password,
      login,
      password: uppassword,
      roleId,
      img: imageUrl,
    });

    await User.update(body, {
      where: { id },
    });
    return sendResStatus(res, 201, "Recpord Updated");
  } catch (error) {
    return sendResStatus(res, 500);
  }
};

exports.index = (req, res) => {
  User.findAll({
    attributes: { exclude: ["createdAt", "updatedAt", "password"] },
  })
    .then((result) => sendResBody(res, 200, result))
    .catch((_) => sendResStatus(res, 500));
};

exports.show = (req, res) => {
  const { id } = req.params;

  User.findByPk(id, {
    attributes: { exclude: ["createdAt", "updatedAt", "password"] },
  })
    .then((result) => sendResBody(res, 200, result))
    .catch((_) => sendResStatus(res, 500));
};
