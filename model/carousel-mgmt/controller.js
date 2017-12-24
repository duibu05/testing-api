const Controller = require('../../lib/controller');
const carouselMgmtFacade = require('./facade');

class CarouselMgmtController extends Controller {
  find(req, res, next){
    this.facade.find(req.query).then(docs => {
      const resData = {
        code: 0, 
        data: {}
      }
      resData.data[req.query.cat] = docs
      res.status(200).json(resData)
    }).catch(err => {
      next(err)
    })
  }
}

module.exports = new CarouselMgmtController(carouselMgmtFacade);
