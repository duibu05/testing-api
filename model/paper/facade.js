const Facade = require('../../lib/facade');
const paperSchema = require('./schema');

class PaperFacade extends Facade {}

module.exports = new PaperFacade('Paper', paperSchema);
