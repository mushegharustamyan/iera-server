const { Op } = require("sequelize");
const { Post } = require("../db/sequelize");
const { sendResBody, sendResStatus } = require("../utils/helpers");
const moment = require("moment");

const STATUS_APPROVED = "approved";

exports.index = async (req, res) => {
  try {
    const { startDate = "1999-01-01", endDate = "9999-12-31", order = "ASC" } = req.query;
    // const { order = "ASC" } = req.params;

    const validOrder = ["DESC", "ASC"];
    const selectedOrder = validOrder.includes(order) ? order : "ASC";

    const start = moment(startDate, "YYYY-MM-DD");
    const end = moment(endDate, "YYYY-MM-DD");

    const [result] = await Promise.all([
      Post.findAll({
        where: {
          status: STATUS_APPROVED,
          [Op.or]: [
            {
              date: {
                [Op.between]: [
                  start.format("YYYY-MM-DD"),
                  end.format("YYYY-MM-DD"),
                ],
              },
            },
            {
              type: "event",
              startDate: { [Op.gte]: start.format("YYYY-MM-DD") },
              endDate: { [Op.lte]: end.format("YYYY-MM-DD") },
            },
          ],
        },
        order: [
          // ["type", "ASC"],?// Order by type in ascending order
          ["date", selectedOrder], // For news, order by date; for events, order by startDate
          ["startDate", selectedOrder], // For events, order by startDate
        ],
      }),
    ]);

    sendResBody(res, 200, result);
  } catch (e) {
    sendResStatus(res, 500);
  }
};


exports.show = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Post.findByPk(id);

    if (!result) {
      sendResStatus(res, 404);
    }

    sendResBody(res, 200, result);
  } catch (e) {
    sendResStatus(res, 500);
  }
};


exports.filter = async (req, res) => {
  const { type } = req.query;

  try {
    const posts = await Post.findAll({
      where: {
        type: type
      },
      order: [['createdAt', 'DESC']]
    });
    sendResBody(res, 200, posts);
  } catch (e) {
    sendResStatus(res, 500);
  }
};

