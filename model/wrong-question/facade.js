const Facade = require('../../lib/facade');
const wrongQuestionSchema = require('./schema');

class WrongQuestionFacade extends Facade {}

module.exports = new WrongQuestionFacade('WrongQuestion', wrongQuestionSchema);
