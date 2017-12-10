const Controller = require('../../lib/controller');
const roleFacade = require('./facade');

class RoleController extends Controller {}

module.exports = new RoleController(roleFacade);
