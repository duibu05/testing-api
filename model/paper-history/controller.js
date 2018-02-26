const Controller = require('../../lib/controller');
const paperHistoryFacade = require('./facade');
const historyFacade = require('../history/facade');

class PaperHistoryController extends Controller {
  findById(req, res, next) {
    Promise.all([this.facade.findById(req.body.id), historyFacade.findOne({ openId: req.body.openId })])
      .then(([doc, history]) => {
        if (!doc) { return res.sendStatus(404); }
        if (!history) {
          history = {
            questionSize: 0,
            correctRate: "0%"
          }
        }
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
