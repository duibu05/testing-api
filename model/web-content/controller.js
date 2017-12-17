const Controller = require('../../lib/controller');
const webContentFacade = require('./facade');

class WebContentController extends Controller {}

module.exports = new WebContentController(webContentFacade);
