const Controller = require('../../lib/controller');
const newsFacade = require('./facade');

class NewsController extends Controller {}

module.exports = new NewsController(newsFacade);
