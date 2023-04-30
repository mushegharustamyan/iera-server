const { Event } = require("../../db/sequelize");
const jwt_decode = require("jwt-decode");
const { Op, where } = require("sequelize");
const {
  sendResStatus,
  sendResBody,
  removeNullOrUndefined,
  s3,
} = require("../../utils/helpers");

const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const eventControllers = () => {
  const create = async (req, res) => {
    const { title, description, startDate, endDate, date } = req.body;
    const file = req.file;
    const { token } = req.headers;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    try {
      const { Location } = await s3.send(new PutObjectCommand(params));
      const news = await Event.create({
        title,
        description,
        startDate,
        endDate,
        authorId: jwt_decode(token).id,
        status: "approved",
        date,
        type: "event",
      });
      sendResStatus(res, 201);
    } catch (error) {
      console.error(error);
      sendResStatus(res, 500);
    }
  };

  const deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
      const event = await Event.findOne({ where: { id } });
      if (!event) {
        return sendResStatus(res, 404);
      }
      const imageUrl = news.img;

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageUrl.split("/").pop(),
      };
      await s3.send(new DeleteObjectCommand(params));

      await Event.delete({ where: { id } });
      return sendResStatus(res, 204);
    } catch (error) {
      return sendResStatus(res, 500);
    }
  };

  const update = async (req, res) => {
    const { id } = req.params;
    const { title, description, startDate, endDate } = req.body;
    const file = req.file;

    try {
      const event = await Event.findOne({ where: { id } });
      if (!event) {
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
      const { Location } = await s3.send(new PutObjectCommand(newParams));

      const body = removeNullOrUndefined({
        title,
        description,
        img: Location,
        startDate,
        endDate,
      });

      await Event.update(body, { where: { id } });
      return sendResStatus(res, 201, "Record Updated");
    } catch (error) {
      return sendResStatus(res, 500, e);
    }
  };
  const index = async (req, res) => {
    const { token } = req.headers;
    const { userId } = jwt.decode(token);

    try {
      const events = await Event.findAll({
        where: {
          authorID: userId,
        },
      });

      return res.status(200).json(events);
    } catch (error) {
      console.error(error);
      return res.sendStatus(500);
    }
  };

  const show = (req, res) => {
    const { id } = req.params;

    Event.findByPk(id)
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

module.exports = eventControllers;
