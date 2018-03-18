const Controller = require('../../lib/controller');
const wrongQuestionFacade = require('./facade');

class WrongQuestionController extends Controller {}

module.exports = new WrongQuestionController(wrongQuestionFacade);
