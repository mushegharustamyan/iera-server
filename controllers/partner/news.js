const { News, Request } = require("../../db/sequelize");
const jwt = require("jsonwebtoken")
const {
  sendResStatus,
  sendResBody,
  removeNullOrUndefined,
} = require("../../utils/helpers");

exports.create = (req, res) => {
  const { title, description, img, date } = req.body;
  const { token } = req.headers;

  News.create({
    title,
    description,
    img,
    date,
    authorId: jwt.decode(token).id,
    status: "pending",
  })
    .then((_) => {
      Request.create({ title }).then(() => sendResStatus(res, 201));
    })
    .catch((_) => sendResStatus(res, 500));
};

exports.index = () => {
  const { token } = req.headers;
  const authorId = jwt_decode(token).id;

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
      { where: filter, authorId },
      { order: [["createdAt", selectedOrder]] }
    )
      .then((result) => sendResBody(res, 200, result))
      .catch((_) => sendResStatus(res, 500));
  }
};

exports.show = (req, res) => {
  const { token } = req.headers;
  const { id } = req.params;
  const authorId = jwt_decode(token).id;

  News.findOne({ where: { id, authorId } })
    .then((result) => sendResBody(res, 200, result))
    .catch((_) => sendResStatus(res, 500));
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { title, description, categorie } = req.body;
  const body = removeNullOrUndefined(title, description, categorie);

  News.update(body, { where: { id } })
    .then((_) => sendResStatus(res, 201, "Post Updated"))
    .catch((_) => sendResStatus(res, 500));
};

exports.delete = (req, res) => {
  const { id } = req.params;

  News.destroy({
    where: {
      id,
    },
  })
    .then((_) => sendResStatus(res, 204))
    .cancel((_) => sendResStatus(res, 500));
};
