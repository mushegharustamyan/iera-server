const { Event } = require("../../db/sequelize")
const { removeNullOrUndefined } = require("../../utils/helpers")
const { sendResStatus, sendResBody } = require("../../utils/helpers")
const { Op } = require("sequelize")

exports.index = (req , res) => {
  // ISO 8601 date format
  const {startDate , endDate} = req.body
  const {order} = req.params ?? "ASC"

  console.log(startDate, endDate)

  const filter = {}

  if(startDate && endDate) filter[Op.and] = [
    { createdAt: { [Op.gte]: startDate } },
    { createdAt: { [Op.lte]: endDate } },
  ], 

  Event.findAll({where: filter}, {order: [["createdAt" , order]]})
  .then((result) => sendResBody(res , 200 , result))
  .catch((_) => sendResStatus(res, 500))
}

exports.show = (req , res) => {
  const {id} = req.params

  Event.findByPk(id)
  .then((post) => sendResBody(res , 200 , post))
  .catch((_) => sendResStatus(res , 500))
}

exports.delete = (req , res) => {
  const {id} = req.params

  Event.destroy({where: {id}})
  .then((_) => sendResStatus(res , 204))
  .catch((_) => sendResStatus(res , 500))
}

exports.update = (req , res) => {
  const {id} = req.params
  const {title , description , img, date} = req.body

  const body = removeNullOrUndefined({
    title,
    description,
    img,
    date
  });

  Event.update(body , {where: {id}})
  .then((_) => sendResStatus(res , 201 , "Record Updated"))
  .catch((_) => sendResStatus(res , 500))
}

exports.create = (req , res) => {
  const {title , description , img , date} = req.body

  Event.create({
    title , 
    description ,
    img,
    date
  })
  .then((_) => sendResStatus(res , 201))
  .catch((_) => sendResStatus(res , 500))
}