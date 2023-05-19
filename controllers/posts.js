const { Op } = require("sequelize");
const { Post } = require("../db/sequelize");
const { sendResBody, sendResStatus } = require("../utils/helpers");
const moment = require("moment");

const STATUS_APPROVED = "approved";

exports.index = async (req, res) => {
  try {
    const {
      startDate = "1999-01-01",
      endDate = "9999-12-31",
      order = "ASC",
      type,
    } = req.query;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const validOrder = ["DESC", "ASC"];
    const selectedOrder = validOrder.includes(order) ? order : "ASC";

    const start = moment(startDate, "YYYY-MM-DD");
    const end = moment(endDate, "YYYY-MM-DD");

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

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

    const [posts] = await Promise.all([
      Post.findAll({
        where: whereClause,
        order: [
          ["date", selectedOrder],
          ["startDate", selectedOrder],
        ],
      }),
    ]);
    const results = {};
    const totalCount = await Post.count();
    results.count = posts.length

    if (startIndex + limit < totalCount) {
      results.next = {
        page: page + 1,
      };
    }
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
      };
    }

    results.result = posts.slice();

    sendResBody(res, 200, results);
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
