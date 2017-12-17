const Facade = require('../../lib/facade');
const lessonSchema = require('./schema');

class LessonFacade extends Facade {}

module.exports = new LessonFacade('Lesson', lessonSchema);
