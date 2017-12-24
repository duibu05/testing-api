const Facade = require('../../lib/facade');
const websiteIndexSchema = require('./schema');

class WebsiteIndexFacade extends Facade {}

module.exports = new WebsiteIndexFacade('WebsiteIndex', websiteIndexSchema);
