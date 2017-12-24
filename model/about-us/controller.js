const Controller = require('../../lib/controller');
const aboutUsFacade = require('./facade');

class AboutUsController extends Controller {
  findOnlyOne(req, res, next){
    this.facade.find({ page: 1, limit: 1}).then(docs => {
      res.json({
        code: 0,
        msg: 'ok',
        data: docs[0]
      })
    })
  }
}

module.exports = new AboutUsController(aboutUsFacade);
