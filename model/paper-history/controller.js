const Controller = require('../../lib/controller');
const paperHistoryFacade = require('./facade');
const historyFacade = require('../history/facade');
const paperFacade = require('../paper/facade');

class PaperHistoryController extends Controller {
  findById(req, res, next) {
    this.facade.findById(req.body.id)
      .then((doc) => {
        if (!doc) { return res.sendStatus(404); }
        const right = doc.questionsHistory.filter(v => {
          if (v.userAnswer.sort().join(',') === v.rightAnswer.sort().join(',')) {
            return true
          }
          return false
        }).length
        const history = {
          questionSize: doc.questionsHistory.length,
          correctRate: Math.round(right / doc.questionsHistory.length * 100) + '%'
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
