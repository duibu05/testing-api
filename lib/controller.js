class Controller {
  constructor(facade) {
    this.facade = facade;
  }

  create(req, res, next) {
    this.facade.create(req.body)
      .then(doc => res.status(201).json({ code:0, data: doc }))
      .catch(err => next(err));
  }

  find(req, res, next) {
    this.facade.count(req.query)
      .then(rows => {
        const pageCount = Math.ceil(5/+req.query.limit)
        if (rows > 0) {
          return this.facade.find(req.query)
            .then(collection => {
              res.status(200).json({
                code:0, 
                data: {
                  list: collection,
                  total: rows,
                  pageCount: pageCount
                }
              })
            })
            .catch(err => next(err));
        } else {
          res.status(200).json({
            code: 0,
            data: {
              list: [],
              total: 0,
              pageCount: 0
            },
          })
        }
      })
      .catch(err => next(err));
  }

  findOne(req, res, next) {
    console.log(req.query)
    return this.facade.findOne(req.query)
      .then(doc => res.status(200).json({ code:0, data: doc }))
      .catch(err => next(err));
  }

  findById(req, res, next) {
    console.log(req.params.id)
    return this.facade.findById(req.params.id)
      .then((doc) => {
        if (!doc) { return res.sendStatus(404); }
        return res.status(200).json({ code:0, data: doc });
      })
      .catch(err => next(err));
  }

  update(req, res, next) {
    this.facade.update({ _id: req.params.id }, req.body)
      .then((results) => {
        if (results.n < 1) { return res.sendStatus(404); }
        if (results.nModified < 1) { return res.sendStatus(304); }
        res.sendStatus(204);
      })
      .catch(err => next(err));
  }

  remove(req, res, next) {
    this.facade.remove({ _id: req.params.id })
      .then((doc) => {
        if (!doc) { return res.sendStatus(404); }
        return res.sendStatus(204);
      })
      .catch(err => next(err));
  }
}

module.exports = Controller;
