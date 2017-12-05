const Controller = require('../../lib/controller');
const aboutUsFacade = require('./facade');

class AboutUsController extends Controller {}

module.exports = new AboutUsController(aboutUsFacade);
