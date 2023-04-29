const { Op } = require("sequelize");
const { News, Event } = require("../db/sequelize");
const {
  sendResBody,
  removeNullOrUndefined,
  sendResStatus,
} = require("../utils/helpers");

exports.index = async (req, res) => {
  const { startDate, endDate } = req.body;
  const { order } = req.params;

  const validOrder = ["DESC", "ASC"];
  const selectedOrder = validOrder.includes(order) ? order : "ASC";

  try {
    let news = await News.findAll({
      where: {
        date: {
          [Op.between]: [
            startDate ? startDate : "01/01/1900",
            endDate ? endDate : "9999/12/31",
          ],
        },
        status: "approved",
      },
      order: [["date", selectedOrder]],
    });

    let events = await Event.findAll({
      where: {
        date: {
          [Op.between]: [
            startDate ?? "01/01/1900",
            endDate ? endDate : "9999/12/31",
          ],
        },
        status: "approved",
      },
      order: [["date", selectedOrder]],
    });

    let result = [...news, ...events];

    sendResBody(res, 200, result);
  } catch (e) {
    sendResBody(res, 500, e);
  }
};

exports.show = async (req, res) => {
  const { id } = req.params;

  try {
    let news = await News.findByPk(id);
    let events = await Event.findByPk(id);
    let result = news ?? events;
    result = result?.dataValues ?? null;

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
