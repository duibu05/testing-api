const _ = require('lodash')

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
    const data = {};
    _.assign(data, req.body, req.params, req.query)
    this.facade.count(data)
      .then(rows => {
        if (rows > 0) {
          const pageCount = Math.ceil(rows / +req.query.limit)
          this.facade.find(req.query)
            .then(collection => {
              res.status(200).json({
                code: 0, 
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
    _.assign(req.body, req.params, req.query)

    return this.facade.findOne(req.body)
      .then(doc => res.status(200).json({ code:0, data: doc }))
      .catch(err => next(err));
  }

  findById(req, res, next) {
    _.assign(req.body, req.params, req.query)

    return this.facade.findById(req.body.id)
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
        res.json({code: 0, data: results});
      })
      .catch(err => next(err));
  }

  remove(req, res, next) {
    this.facade.remove({ _id: req.params.id })
      .then((doc) => {
        if (!doc) { return res.sendStatus(404); }
        return res.json({code: 0, data: {}, msg: 'ok'});
      })
      .catch(err => next(err));
  }
}

module.exports = Controller;
