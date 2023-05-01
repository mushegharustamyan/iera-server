const { News } = require("../db/sequelize");
const { removeNullOrUndefined } = require("../utils/helpers");
const { sendResStatus, sendResBody } = require("../utils/helpers");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const { s3 } = require("../utils/helpers");

const newsController = () => {
  const index = (req, res) => {
    const { startDate, endDate } = req.body;
    const { order } = req.params;

    const validOrder = ["DESC, ASC"];
    const selectedOrder = validOrder.includes(order) ? order : "ASC";

    if (!startDate && !endDate) {
      return News.findAll({ order: [["createdAt", selectedOrder]] })
        .then((result) => sendResBody(res, 200, result))
        .catch((_) => sendResStatus(res, 500));
    } else {
      const filter =
        startDate && endDate
          ? {
              [Op.and]: [
                { date: { [Op.gte]: startDate } },
                { date: { [Op.lte]: endDate } },
              ],
            }
          : { date: { [Op.lte]: startDate ?? endDate } };

      return News.findAll(
        { where: filter },
        { order: [["createdAt", selectedOrder]] }
      )
        .then((result) => sendResBody(res, 200, result))
        .catch((e) => sendResBody(res, 500, e));
    }
  };

  const show = (req, res) => {
    const { id } = req.params;

    News.findByPk(id)
      .then((post) => sendResBody(res, 200, post))
      .catch((_) => sendResStatus(res, 500));
  };

  const deleteNews = async (req, res) => {
    const { id } = req.params;

    try {
      const news = await News.findOne({ where: { id } });
      if (!news) {
        return sendResStatus(res, 404);
      }

      const imageUrl = news.img;

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageUrl.split("/").pop(),
      };
      await s3.send(new DeleteObjectCommand(params));

      await News.destroy({ where: { id } });

      return sendResStatus(res, 204);
    } catch (error) {
      console.error(error);
      return sendResStatus(res, 500);
    }
  };

  const update = async (req, res) => {
    const { id } = req.params;
    const { title, description, date } = req.body;
    const file = req.file;

    try {
      const news = await News.findOne({ where: { id } });
      if (!news) {
        return sendResStatus(res, 404);
      }

      const imageUrl = news.img;

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageUrl.split("/").pop(),
      };
      await s3.send(new DeleteObjectCommand(params));

      const newKey = `${Date.now()}_${file.originalname}`;
      const newParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: newKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      await s3.send(new PutObjectCommand(newParams));
      const location = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;

      const body = removeNullOrUndefined({
        title,
        description,
        img: location,
        date,
        status: "approved",
        
      });
      await News.update(body, { where: { id } });

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
        img: location,
        date,
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

    News.update({ status: "approved" }, { where: { id } })
      .then((_) => sendResStatus(res, 203))
      .catch((_) => sendResStatus(res, 500));
  };

  const decline = (req, res) => {
    const { id } = req.params;
    const { requestId } = req.query;
    const { reason } = req.body;

    News.update({ status: "rejected" }, { where: { id } })
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
