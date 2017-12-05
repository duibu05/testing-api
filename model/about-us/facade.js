const Facade = require('../../lib/facade');
const aboutUsSchema = require('./schema');

class AboutUsFacade extends Facade {}

module.exports = new AboutUsFacade('AboutUs', aboutUsSchema);
