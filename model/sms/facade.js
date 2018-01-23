const Facade = require('../../lib/facade');
const smsSchema = require('./schema');

class SmsFacade extends Facade {}

module.exports = new SmsFacade('Sms', smsSchema);
