const Facade = require('../../lib/facade');
const carouselMgmtSchema = require('./schema');

class CarouselMgmtFacade extends Facade {}

module.exports = new CarouselMgmtFacade('CarouselMgmt', carouselMgmtSchema);
