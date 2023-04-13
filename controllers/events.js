const { Event } = require("../db/sequelize");
const { removeNullOrUndefined } = require("../utils/helpers");
const { sendResStatus, sendResBody } = require("../utils/helpers");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken")

const eventsController = (req, res) => {
  const index = (req, res) => {
    // ISO 8601 date format
    const { startDate, endDate } = req.body;
    const { order } = req.params;

    const validOrder = ["DESC, ASC"];
    const selectedOrder = validOrder.includes(order) ? order : "ASC";

    const filter =
      startDate && endDate
        ? {
            [Op.and]: [
              { date: { [Op.gte]: startDate } },
              { date: { [Op.lte]: endDate } },
            ],
          }
        : {};

    Event.findAll({ where: filter }, { order: [["date", selectedOrder]] })
      .then((result) => sendResBody(res, 200, result))
      .catch((_) => sendResStatus(res, 500));
  };

  const show = (req, res) => {
    const { id } = req.params;

    Event.findByPk(id)
      .then((post) => sendResBody(res, 200, post))
      .catch((_) => sendResStatus(res, 500));
  };

  const deleteEvents = (req, res) => {
    const { id } = req.params;

    Event.destroy({ where: { id } })
      .then((_) => sendResStatus(res, 204))
      .catch((_) => sendResStatus(res, 500));
  };

  const update = (req, res) => {
    const { id } = req.params;
    const { title, description, img, date } = req.body;
    const { token } = req.headers;
  
    const body = removeNullOrUndefined({
      title,
      description,
      img,
      date,
      authorId: jwt.decode(token).id,
    });
  
    Event.update(body, { where: { id } })
      .then((_) => sendResStatus(res, 201, "Record Updated"))
      .catch((_) => sendResStatus(res, 500));
  };

  const create = (req, res) => {
    const { title, description, img, date } = req.body;
    const { token } = req.headers;
    Event.create({
      title,
      description,
      img,
      date,
      authorId: jwt.decode(token).id,
    })
      .then((_) => sendResStatus(res, 201))
      .catch((_) => sendResStatus(res, 500));
  };

  return {
    index,
    show,
    delete: deleteEvents,
    update,
    create,
  }
};

module.exports = eventsController