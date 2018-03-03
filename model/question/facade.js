const Facade = require('../../lib/facade');
const paperFacade = require('../paper/facade');
const questionSchema = require('./schema');

class QuestionFacade extends Facade {
  findNextQuestion(id, paperId) {
    paperFacade.findById(paperId).then(paper => {
      let qid = '';
      for (let i = 0, len = paper.questions.length; i < len; i++) {
        if (paper.questions[i].id === id) {
          qid = paper.questions[i+1].id
          break;
        }
      }
      return this.model
        .findById(qid)
        .exec();
    }).catch(err => next(err));
  }
}

module.exports = new QuestionFacade('Question', questionSchema);
