const Controller = require('../../lib/controller');
const paperFacade = require('./facade');

class PaperController extends Controller {}

module.exports = new PaperController(paperFacade);
