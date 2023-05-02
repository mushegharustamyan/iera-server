const { Event } = require("../db/sequelize");
const jwt = require("jsonwebtoken");
const { Op, where } = require("sequelize");
const {
  sendResStatus,
  sendResBody,
  removeNullOrUndefined,
  s3,
} = require("../utils/helpers");

const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const eventControllers = () => {
  const create = async (req, res) => {
    const { title, description, startDate, endDate, date } = req.body;
    const file = req.file;
    const { token } = req.headers;

    const formatDate = new Date(date);
    const formatStartDate = new Date(startDate);
    const formaEndDate = new Date(endDate);

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    try {
      await s3.send(new PutObjectCommand(params));
      const location = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
      const event = await Event.create({
        title,
        description,
        startDate: formatStartDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        endDate: formaEndDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        authorId: jwt.decode(token).id,
        status: "approved",
        date: formatDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        type: "event",
        img: location,
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
      const imageUrl = event.img;

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageUrl.split("/").pop(),
      };
      await s3.send(new DeleteObjectCommand(params));

      await Event.destroy({ where: { id } });
      return sendResStatus(res, 204);
    } catch (error) {
      console.log(error);
      return sendResStatus(res, 500);
    }
  };

  const update = async (req, res) => {
    const { id } = req.params;
    const { title, description, startDate, endDate } = req.body;
    const file = req.file;

    const formatStartDate = new Date(startDate);
    const formaEndDate = new Date(endDate);

    try {
      const event = await Event.findOne({ where: { id } });
      if (!event) {
        return sendResStatus(res, 404);
      }
      const imageUrl = event.img;
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
        startDate: formatStartDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        endDate: formaEndDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      });

      await Event.update(body, { where: { id } });
      return sendResStatus(res, 201, "Record Updated");
    } catch (error) {
      return sendResStatus(res, 500, e);
    }
  };

  const index = (req, res) => {
    Event.findAll()
      .then((result) => sendResBody(res, 200, result))
      .catch((_) => sendResStatus(res, 500));
  };

  const show = (req, res) => {
    const { id } = req.params;

    Event.findByPk(id)
      .then((post) => sendResBody(res, 200, post))
      .catch((_) => sendResStatus(res, 500));
  };

  const approve = (req, res) => {
    const { id } = req.params;

    Event.update({ status: "approved" }, { where: { id } })
      .then((_) => sendResStatus(res, 203))
      .catch((_) => sendResStatus(res, 500));
  };

  const decline = (req, res) => {
    const { id } = req.params;
    const { requestId } = req.query;
    const { reason } = req.body;

    Event.update({ status: "rejected" }, { where: { id } })
      .then((_) => {
        Request.update({ reason }, { where: { id: requestId } }).then((_) =>
          sendResStatus(res, 200)
        );
      })
      .catch((_) => sendResStatus(res, 500));
  };

  return {
    create,
    index,
    show,
    update,
    delete: deleteEvent,
    approve,
    decline,
  };
};

module.exports = eventControllers;
