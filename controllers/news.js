const { Post } = require("../db/sequelize");
const { removeNullOrUndefined } = require("../utils/helpers");
const { sendResStatus, sendResBody } = require("../utils/helpers");
const jwt = require("jsonwebtoken");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const { s3 } = require("../utils/helpers");

const newsController = () => {
  const index = (req, res) => {
    Post.findAll()
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

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageUrl.split("/").pop(),
      };
      await s3.send(new DeleteObjectCommand(params));

      await Post.destroy({ where: { id } });

      return sendResStatus(res, 204);
    } catch (error) {
      console.error(error);
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

      const imageUrl = news.img;
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
        title,
        description,
        img: imageUrl,
        status: "approved",
      });
      await Post.update(body, { where: { id } });
      Request.update({reason: null}, {where: {postId: id}})

      return sendResStatus(res, 200, "Record updated");
    } catch (error) {
      console.error(error);
      return sendResStatus(res, 500);
    }
  };

  const create = async (req, res) => {
    const { title, description, date } = req.body;
    const { token } = req.headers;
    const file = req.file;

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
      await Post.create({
        title,
        description,
        img: location,
        date: formatDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        authorId: jwt.decode(token).id,
        status: "approved",
        type: "news",
      });
      sendResStatus(res, 201);
    } catch (error) {
      console.error(error);
      sendResStatus(res, 500);
    }
  };

  const approve = (req, res) => {
    const { id } = req.params;

    Post.update({ status: "approved" }, { where: { id } })
      .then((_) => {
        Request.destroy({where: {postId: id}})
        .then(_ => sendResStatus(res, 203))
        .catch((_) => sendResStatus(res, 500));
      })
      .catch((_) => sendResStatus(res, 500));
  };

  const decline = (req, res) => {
    const { id } = req.params;
    const { requestId } = req.query;
    const { reason } = req.body;

    Post.update({ status: "rejected" }, { where: { id } })
      .then((_) => {
        Request.update({ reason }, { where: { id: +requestId } }).then((_) =>
          sendResStatus(res, 200)
        );
      })
      .catch((_) => sendResStatus(res, 500));
  };

  return {
    index,
    show,
    delete: deleteNews,
    update,
    create,
    approve,
    decline,
  };
};

module.exports = newsController;
