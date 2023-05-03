const { Op } = require("sequelize");
const { Post } = require("../db/sequelize");
const {
  sendResBody,
  sendResStatus,
} = require("../utils/helpers");

exports.index = async (req, res) => {
  const { startDate, endDate } = req.body;
  const { order } = req.params;

  const validOrder = ["DESC", "ASC"];
  const selectedOrder = validOrder.includes(order) ? order : "ASC";

  try {
    let result = await Post.findAll({
      where: {
        date: {
          [Op.between]: [
            startDate ? startDate : "01/01/1900",
            endDate ? endDate : "31/12/9999",
          ],
        },
        status: "approved",
      },
      order: [["date", selectedOrder]],
    });

    sendResBody(res, 200, result);
  } catch (e) {
    sendResBody(res, 500, e);
  }
};

exports.show = async (req, res) => {
  const { id } = req.params;

  try {
    let result = await Post.findByPk(id)

    sendResBody(res, 200, result);
  } catch (e) {
    sendResStatus(res, 500);
  }
};

exports.filter = async (req, res) => {
  const { type } = req.query;
  switch (type) {
    case "news":
      try {
        const result = await News.findAll();
        sendResBody(res, 200, result);
      } catch (e) {
        sendResStatus(res, 404);
      }
      break;
    case "events":
      try {
        const result = await Event.findAll();
        sendResBody(res, 200, result);
      } catch (e) {
        sendResStatus(res, 500);
      }
      break;
    default:
      console.log("error");
  }
};
