const { Post } = require("../db/sequelize");
const jwt = require("jsonwebtoken");
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
        startDate: formatStartDate.toISOString().slice(0, 10),
        endDate: formaEndDate.toISOString().slice(0, 10),
        authorId: jwt.decode(token).id,
        status: "approved",
        date: formatDate.toISOString().slice(0, 10),
        type: "event",
        img: Location,
      });

      sendResStatus(res, 201);
    } catch (error) {
      sendResStatus(res, 500);
    }
  };

  const deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
      const event = await Post.findOne({ where: { id } });
      if (!event) {
        return sendResStatus(res, 404);
      }
      const imageUrl = event.img;
      if (imageUrl) {
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: imageUrl.split("/").pop(),
        };
        await s3.send(new DeleteObjectCommand(params));
      }

      await Post.destroy({ where: { id } });
      return sendResStatus(res, 204);
    } catch (error) {
      return sendResStatus(res, 500);
    }
  };

  const update = async (req, res) => {
    const { id } = req.params;
    const { title, description, startDate, endDate } = req.body;
    const file = req.file;

    const formatStartDate = startDate
      ? new Date(startDate).toISOString().slice(0, 10)
      : null;
    const formatEndDate = endDate
      ? new Date(endDate).toISOString().slice(0, 10)
      : null;

    try {
      const event = await Post.findOne({ where: { id } });

      if (event.img !== null) {
        let imageUrl = event.img;
        if (file) {
          const oldKey = imageUrl.split("/").pop();
          const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: oldKey,
          };
          await s3.send(new DeleteObjectCommand(deleteParams));
        }

        const newKey = `${Date.now()}_${file.originalname}`;
        const uploadParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: newKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        };
        await s3.send(new PutObjectCommand(uploadParams));
        const url = `https://${uploadParams.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
        imageUrl = url;
      }
      const body = removeNullOrUndefined({
        title,
        description,
        img: imageUrl,
        startDate: formatStartDate,
        endDate: formatEndDate,
      });

      await Post.update(body, { where: { id } });
      return sendResStatus(res, 201, "Record Updated");
    } catch (error) {
      return sendResStatus(res, 500, e);
    }
  };

  const index = (req, res) => {
    Post.findAll({
      where: {
        type: "event",
      },
    })
      .then((result) => sendResBody(res, 200, result))
      .catch((_) => sendResStatus(res, 500));
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
    delete: deleteEvent,
  };
};

module.exports = eventControllers;
