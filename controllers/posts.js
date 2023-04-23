const { Op } = require("sequelize");
const { News, Event } = require("../db/sequelize");
const { sendResBody, removeNullOrUndefined, sendResStatus } = require("../utils/helpers");

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
            startDate ? startDate : "01-01-1900",
            endDate ? endDate : "9999-12-31",
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
            startDate ?? "01-01-1900",
            endDate ? endDate : "9999-12-31",
          ],
        },
        status: "approved",
      },
      order: [["date", selectedOrder]],
    });

    let result = [...news, ...events].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    sendResBody(res, 200, result);
  } catch (e) {
    sendResBody(res, 500, e);
  }
};

exports.show = async (req, res) => {
  const { title } = req.query;

  try {
    let news = await News.findOne({ where: { title } });
    let events = await Event.findOne({ where: { title } });
  
    let result = news ?? events;
    result = result?.dataValues ?? null;
  
    sendResBody(res, 200, result);
  } catch (e) {
    sendResStatus(res, 500);
  }
}
