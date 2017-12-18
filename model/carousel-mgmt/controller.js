const Controller = require('../../lib/controller');
const carouselMgmtFacade = require('./facade');

class CarouselMgmtController extends Controller {}

module.exports = new CarouselMgmtController(carouselMgmtFacade);
