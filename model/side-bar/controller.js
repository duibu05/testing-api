const Controller = require('../../lib/controller');
const sideBarFacade = require('./facade');

class SideBarController extends Controller {}

module.exports = new SideBarController(sideBarFacade);
