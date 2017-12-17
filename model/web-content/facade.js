const Facade = require('../../lib/facade');
const webContentSchema = require('./schema');

class WebContentFacade extends Facade {}

module.exports = new WebContentFacade('WebContent', webContentSchema);
