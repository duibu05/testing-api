const Facade = require('../../lib/facade');
const newsSchema = require('./schema');

class NewsFacade extends Facade {}

module.exports = new NewsFacade('News', newsSchema);
