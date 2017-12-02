const Controller = require('../../lib/controller');
const joinerFacade = require('./facade');

class JoinerController extends Controller {}

module.exports = new JoinerController(joinerFacade);
