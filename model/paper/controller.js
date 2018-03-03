const Controller = require('../../lib/controller');
const paperFacade = require('./facade');
const paperHistoryFacade = require('../paper-history/facade');
const historyFacade = require('../history/facade');
const questionFacade = require('../question/facade');

class PaperController extends Controller {
  commit(req, res, next) {
    // 交卷： 计算得分 设置试卷记录状态等
    Promise.all([
      paperFacade.findOne({ _id: req.body.paperId }), 
      paperHistoryFacade.findOne({ paperId: req.body.paperId, status: 1 }), 
      historyFacade.findOne({ openId: req.body.openId }),
      questionFacade.findById(req.body.currentQuestionId)
    ]).then(([paper, paperHistory, history, question]) => {
      const exist = paperHistory.questionsHistory.filter(v => v._id === req.body.currentQuestionId).length
      const userAnswer = req.body.currentUserAnswer.split(',')
      if (!exist) {
        for (let l = 0, llen = paper.questions.length; l < llen; l++) {
          if (req.body.currentQuestionId === paper.questions[l].id) {
            const temQuestion = JSON.parse(JSON.stringify(question))
            temQuestion.userAnswer = userAnswer
            temQuestion.points = +paper.questions[l].points
            paperHistory.questionsHistory.push(temQuestion)
            break;
          }
        }
      }

      const emptyHistory = false
      
      if (!history) {
        emptyHistory = true
        history = {
          openId: req.body.openId,
          questionSize: 0,
          rightQuestionSize: 0,
          correctRate: '0%'
        }
      }
      let correctPercentage = '', total = paper.questions.length + history.questionSize, right = 0, userScore = 0, questions = paperHistory.questionsHistory || [];

      for (let i = 0, len = questions.length; i < len; i++) {
        if (req.body.currentQuestionId === questions[i].id) {
            questions[i].userAnswer = userAnswer
        }
        if (questions[i].userAnswer.sort().join(',') === questions[i].rightAnswer.sort().join(',')) {
            userScore += +(questions[i].points || 0)
            right += 1
        }
      }

      correctPercentage = Math.round(right / paper.questions.length * 100) + '%'

      const newHistory = {
        questionSize: total,
        rightQuestionSize: right + history.rightQuestionSize,
        correctRate: Math.round((right + history.rightQuestionSize) / total * 100) + '%',
        openId: req.body.openId
      }

      if (emptyHistory) {
        historyFacade.create(newHistory)
      } else {
        historyFacade.update({ openId: req.body.openId }, newHistory)
      }

      paperHistoryFacade.update({ _id: paperHistory._id }, {
        status: 2,
        score: +userScore,
        questionsHistory: paperHistory.questionsHistory,
        progress: paper.questions.length,
        questionSize: paper.questions.length
      }).then(result2 => {
        res.json({
            code: 0,
            msg: 'ok',
            data: {
              statistics:{
                correctRate: correctPercentage,
                questionSize: paper.questions.length
              },
              paperHistory: {
                score: userScore,
                _id: paperHistory._id
              }
            }
        })
      });
    })
  }
}

module.exports = new PaperController(paperFacade);
