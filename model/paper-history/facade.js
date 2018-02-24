const Facade = require('../../lib/facade');
const paperHistorySchema = require('./schema');

class PaperHistoryFacade extends Facade {}

module.exports = new PaperHistoryFacade('PaperHistory', paperHistorySchema);
