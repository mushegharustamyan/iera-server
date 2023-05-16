const { Op } = require("sequelize");
const { Post } = require("../db/sequelize");
const { sendResBody, sendResStatus } = require("../utils/helpers");
const moment = require("moment");

const STATUS_APPROVED = "approved";

exports.index = async (req, res) => {
  try {
    const { startDate = "1999-01-01", endDate = "9999-12-31", order = "ASC", type } = req.query;

    const validOrder = ["DESC", "ASC"];
    const selectedOrder = validOrder.includes(order) ? order : "ASC";

    const start = moment(startDate, "YYYY-MM-DD");
    const end = moment(endDate, "YYYY-MM-DD");

    const whereClause = {
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
    };

    if (type) {
      whereClause[Op.and] = { type };
    }

    const [result] = await Promise.all([
      Post.findAll({
        where: whereClause,
        order: [
          ["date", selectedOrder],
          ["startDate", selectedOrder],
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


