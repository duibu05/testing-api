const Facade = require('../../lib/facade');
const sideBarSchema = require('./schema');

class SideBarFacade extends Facade {}

module.exports = new SideBarFacade('SideBar', sideBarSchema);
