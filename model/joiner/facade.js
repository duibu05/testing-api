const Facade = require('../../lib/facade');
const joinerSchema = require('./schema');

class JoinerFacade extends Facade {}

module.exports = new JoinerFacade('Joiner', joinerSchema);
