const Controller = require('../../lib/controller');
const lessonFacade = require('./facade');

class LessonController extends Controller {}

module.exports = new LessonController(lessonFacade);
