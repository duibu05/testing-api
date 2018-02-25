const Controller = require('../../lib/controller');
const questionFacade = require('./facade');
const categoryFacade = require('../category/facade')

class QuestionController extends Controller {
  upload(req, res, next) {
    Promise.all([
      categoryFacade.findOne({ type: 'shiti', name: req.body.firstCat.name, level: 'first' }),
      categoryFacade.findOne({ type: 'shiti', name: req.body.secondCat.name, level: 'second' })
    ]).then(([cf, cs]) => {
      req.body.firstCat.id = cf._id
      req.body.secondCat.id = cs._id
      this.facade.create(req.body).then(result => {
        res.json({
          code: 0, 
          msg: 'ok',
          data: result
        })
      })
    })
    .catch(e => next(e))
  }
}

module.exports = new QuestionController(questionFacade);
