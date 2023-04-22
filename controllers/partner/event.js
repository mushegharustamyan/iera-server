exports.create = (req , res) => {
    const {title , description , startDate , endDate} = req.body

    const {token} = req.headers;

    Event.create({title , description , startDate , endDate ,authorId: jwt_decode(token).id})
        .then(_ => sendResStatus(res , 201))
        .catch(_ => sendResStatus(res , 500))
}

exports.delete = (req , res) => {
    const {id} = req.params

    Event.delete({where: {id}})
        .then(_ => sendResStatus(res , 201))
        .catch(_ => sendResStatus(res , 500))
}

exports.update = (req, res) => {
    const { id } = req.params;
    const { title, description, img ,startDate , endDate} = req.body;

    const body = removeNullOrUndefined({
    title,
    description,
    startDate,
    endDate
    });

    Event.update(body, { where: { id } })
    .then((_) => sendResStatus(res, 201, "Record Updated"))
    .catch((_) => sendResStatus(res, 500));
};

exports.index = (req, res) => {
    // ISO 8601 date format
    const { startDate, endDate } = req.body;
    const { order } = req.params;

    const validOrder = ["DESC, ASC"];
    const selectedOrder = validOrder.includes(order) ? order : "ASC";

    if(!startDate && !endDate) {
    return Event.findAll({ order: [["createdAt", selectedOrder]] })
    .then((result) => sendResBody(res, 200, result))
    .catch((_) => sendResStatus(res, 500));
    } else {
    const filter = 
        startDate && endDate
        ? {
            [Op.and]: [
                { startDate: { [Op.gte]: startDate } },
                { endDate: { [Op.lte]: endDate } },
            ],
            }
        : { date: { [Op.lte]: startDate ?? endDate } }

    return Event.findAll({ where: filter }, { order: [["createdAt", selectedOrder]] })
        .then((result) => sendResBody(res, 200, result))
        .catch((_) => sendResStatus(res, 500));
    }
};

exports.show = (req , res) => {
    const { id } = req.params;

    Event.findByPk(id)
        .then((post) => sendResBody(res, 200, post))
        .catch((_) => sendResStatus(res, 500));
}