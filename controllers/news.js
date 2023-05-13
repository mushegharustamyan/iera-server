const { Post, Request } = require("../db/sequelize");
const { removeNullOrUndefined } = require("../utils/helpers");
const { sendResStatus, sendResBody } = require("../utils/helpers");
const jwt = require("jsonwebtoken");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const { s3 } = require("../utils/helpers");
const { where } = require("sequelize");

const newsController = () => {
  const index = (req, res) => {
    Post.findAll({
      where: {
        type: "news",
      },
    })
      .then((result) => sendResBody(res, 200, result))
      .catch((e) => sendResBody(res, 500, e));
  };

  const show = (req, res) => {
    const { id } = req.params;

    Post.findByPk(id)
      .then((post) => sendResBody(res, 200, post))
      .catch((_) => sendResStatus(res, 500));
  };

  const deleteNews = async (req, res) => {
    const { id } = req.params;

    try {
      const news = await Post.findOne({ where: { id } });
      if (!news) {
        return sendResStatus(res, 404);
      }

      const imageUrl = news.img;
      if (imageUrl) {
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: imageUrl.split("/").pop(),
        };
        await s3.send(new DeleteObjectCommand(params));
      }

      const request = await Request.findOne({ where: { postId: id } });
      if (request) {
        await Request.destroy({ where: { postId: id } });
      }
      await Post.destroy({ where: { id } });

      sendResStatus(res, 204);
    } catch (error) {
      return sendResStatus(res, 500);
    }
  };

  const update = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const file = req.file;

    try {
      const news = await Post.findOne({ where: { id } });
      if (!news) {
        return sendResStatus(res, 404);
      }

      let  imageUrl = news.img;
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
        await s3.send(new PutObjectCommand(uploadParams));
        const location = `https://${uploadParams.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
        imageUrl = location;
      }
      const body = removeNullOrUndefined({
        title,
        description,
        img: imageUrl,
        status: "approved",
      });
      await Post.update(body, { where: { id } });
      Request.update({ reason: null }, { where: { postId: id } });

      return sendResStatus(res, 201, "Record updated");
    } catch (error) {
      return sendResStatus(res, 500);
    }
  };

  const create = async (req, res) => {
    const { title, description, date } = req.body;
    const { token } = req.headers;
    const file = req.file;

    const formatDate = new Date(date);

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

      await Post.create({
        title,
        description,
        img: Location,
        date: formatDate.toISOString().slice(0, 10),
        authorId: jwt.decode(token).id,
        status: "approved",
        type: "news",
      });
      sendResStatus(res, 201);
    } catch (error) {
      sendResStatus(res, 500);
    }
  };
  return {
    index,
    show,
    delete: deleteNews,
    update,
    create,
  };
};

module.exports = newsController;
