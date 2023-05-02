const { News, Request } = require("../../db/sequelize");
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

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    try {
      await s3.send(new PutObjectCommand(params));
      const location = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
      const news = await News.create({
        title,
        description,
        authorId: jwt.decode(token).id,
        status: "pending",
        date: formatDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        type: "news",
        img: location,
      });
      const request = await Request.create({
        title: news.title,
        postId: news.id,
      });
      sendResStatus(res, 201);
    } catch (error) {
      console.error(error);
      sendResStatus(res, 500);
    }
  };

  const update = async (req, res) => {
    const { id } = req.params;
    const { title, description, startDate, endDate } = req.body;
    const file = req.file;

    try {
      const news = await News.findOne({ where: { id } });
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
        await s3.send(new PutObjectCommand(newParams));
        const location = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
        imageUrl = location;
      }

      const body = removeNullOrUndefined({
        title,
        description,
        img: imageUrl,
        status: "pending",
      });

      const post = await News.update(body, { where: { id } });
      const request = await Request.create({
        title: post.title,
        postId: post.id,
      });
      return sendResStatus(res, 201, "Record Updated");
    } catch (error) {
      return sendResStatus(res, 500, e);
    }
  };

  const index = async (req, res) => {
    const { token } = req.headers;
    const { userId } = jwt.decode(token);

    try {
      const news = await News.findAll({
        where: {
          authorID: userId,
        },
      });

      return sendResBody(res, 200, news);
    } catch (error) {
      console.error(error);
      return res.sendStatus(500);
    }
  };

  const show = (req, res) => {
    const { id } = req.params;

    News.findByPk(id)
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
