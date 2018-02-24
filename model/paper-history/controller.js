const Controller = require('../../lib/controller');
const paperHistoryFacade = require('./facade');
const history = require('../history/facade');

class PaperHistoryController extends Controller {
  findById(req, res, next) {
    Promise.all([this.facade.findById(req.body.id), history.facade.findOne({ openId: req.body.openId })])
      .then(([doc, history]) => {
        if (!doc) { return res.sendStatus(404); }
        return res.status(200).json({
            code:0,
            data: {
              statistics: history,
              paperHistory: doc
            }
        });
      })
      .catch(err => next(err));
  }
}

module.exports = new PaperHistoryController(paperHistoryFacade);
