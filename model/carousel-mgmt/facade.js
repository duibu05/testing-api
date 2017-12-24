const Facade = require('../../lib/facade');
const carouselMgmtSchema = require('./schema');

class CarouselMgmtFacade extends Facade {
  find(...args) {
    return this.model.find(...args).exec();
  }
}

module.exports = new CarouselMgmtFacade('CarouselMgmt', carouselMgmtSchema);
