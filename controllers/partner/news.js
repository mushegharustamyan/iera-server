const { News, Request, Post } = require("../../db/sequelize");
const jwt = require("jsonwebtoken");
const { Op, where } = require("sequelize");
const {
  sendResStatus,
  sendResBody,
  removeNullOrUndefined,
  s3,
} = require("../../utils/helpers");

const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const newsControllers = () => {
  const create = async (req, res) => {
    const { title, description, date } = req.body;
    const file = req.file;
    const { token } = req.headers;

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
      const news = await Post.create({
        title,
        description,
        authorId: jwt.decode(token).id,
        status: "pending",
        date: formatDate.toISOString().slice(0, 10),
        type: "news",
        img: Location,
      });
      await Request.create({
        title: news.title,
        postId: news.id,
      });
      sendResStatus(res, 201);
    } catch (error) {
      sendResStatus(res, 500);
    }
  };

  const update = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const file = req.file;

    try {
      const news = await Post.findByPk(id);
      if (!news) {
        return sendResStatus(res, 404);
      }

      let imageUrl = news.img;
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
        status: "pending",
      });

      const post = await Post.update(body, { where: { id } });
      await Request.update(
        {
          reason: null,
        },
        { where: { postId: id } }
      );
      return sendResStatus(res, 201, "Record Updated");
    } catch (error) {
      return sendResStatus(res, 500, e);
    }
  };

  const index = async (req, res) => {
    const { token } = req.headers;
    const { id } = jwt.decode(token);

    try {
      const news = await Post.findAll({
        where: {
          authorId: id,
          type: "news",
        },
      });

      return sendResBody(res, 200, news);
    } catch (error) {
      return res.sendStatus(500);
    }
  };

  const show = (req, res) => {
    const { id } = req.params;

    Post.findByPk(id)
      .then((post) => sendResBody(res, 200, post))
      .catch((_) => sendResStatus(res, 500));
  };

  return {
    create,
    index,
    show,
    update,
  };
};

module.exports = newsControllers;
