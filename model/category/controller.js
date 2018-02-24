const Controller = require('../../lib/controller');
const categoryFacade = require('./facade');
const paperFacade = require('../paper/facade');
const questionFacade = require('../question/facade');
const paperHistoryFacade = require('../paper-history/facade');
const _ = require('lodash');

class CategoryController extends Controller {
  findQuestionDetails(req, res, next) {
    Promise.all([
      questionFacade.findById(req.body.questionId), 
      paperFacade.findById(req.body.paperId),
      paperHistoryFacade.findOne({ openId: req.body.openId, paperId: req.body.paperId, status: 1 })
    ]).then(([question, paper, paperHistory]) => {
      const point = (() => {
        let point = 0
        for (let j = 0, len = paper.questions.length; j < len; j++) {
          if (paper.questions[j].id === req.body.questionId) {
            point = paper.questions[j].point 
            break;
          }
        }

        return point
      })()
      const userSelectedAnswer = req.body.userAnswer.split(',')

      if (paperHistory) {
        for (let i = 0, len = paperHistory.questionsHistory.length; i < len; i++) {
          if (paperHistory.questionsHistory[i].id === req.body.questionId) {
            paperHistory.questionsHistory[i].userAnswer = userSelectedAnswer
            paperHistory.questionsHistory[i].point = point
            paperHistory.questionSize = paper.questions.length

            break;
          }
        }
        paperHistoryFacade.update({ _id: paperHistory._id }, {
          questionsHistory: paperHistory.questionsHistory,
          questionSize: paperHistory.questionSize
        })
      } else {
        const questionHistory = {
          userAnswer: userSelectedAnswer,
          point: point,
        }

        _.assign(questionHistory, JSON.parse(JSON.stringify(question)))

        paperHistoryFacade.create({
          paperId: req.body.paperId,
          title: paper.title,
          image: paper.image,
          score: 0,
          progress: 1,
          questionSize: paper.questions.length,
          questionsHistory: [questionHistory],
          status: 1,
          openId: req.body.openId,
        })
      }
      res.json({
        code: 0,
        msg: 'ok!',
        data: question
      })
    });
  }

  findPaperDetails(req, res, next) {
    paperFacade.findOne({_id: req.body.paperId}).then(paper => {
      if (!paper.questions.length) {
        return res.json({
          code: 0,
          msg: 'ok!',
          data: paper
        })
      }
      questionFacade.findById(paper.questions[0].id).then(question => {
        if (question) {
          paper.questions[0].details = question
        }
        res.json({
          code: 0,
          msg: 'ok!',
          data: paper
        })
      })
    })
  }

  findPaper(req, res, next) {
    paperFacade.find({ 'firstCat.id': req.body.targetId, 'secondCat.id': req.body.subjectId, 'thirdCat.id': req.body.categoryId }).then(paper => {
      const results = [];
      if (paper) {
        
        for (let i = 0, len = paper.length; i < len; i++) {
          
          results.push({
            _id: paper[i]._id,
            title: paper[i].title,
            progress: '14/100'
          })
        }

        res.json({
          code: 0,
          msg: 'ok',
          data: results
        })
      }
    });
  }
  
  findSubject(req, res, next){
    categoryFacade.find({ type: 'shijuan', level: 'second' }).then(subjects => {
      res.json({
        code: 0,
        msg: 'ok!',
        data: subjects
      })
    })
  }

  findCategory(req, res, next) {
    categoryFacade.find({ type: 'shijuan', level: 'third' }).then(cats => {
      const results = [];
      for(let i = 0, len = cats.length; i < len; i++) {
        results.push({
          _id: cats[i]._id,
          name: cats[i].name,
          image: cats[i].image,
          progress: '15/255'
        })
      }

      res.json({
        code: 0,
        msg: 'ok!',
        data: results
      })
    })
  }

  findByTypeAndRebuildDate(req, res, next) {
    req.query.level = 'first';
    this.facade.find(req.query)
      .then(docs => {
        if(req.query.type === 'wechat-content'){
          return res.json({ code: 0, data: {
            first: {
              label: '微信小程序分类管理',
              list: docs
            }
          } })
        }

        req.query.level = 'second';
        this.facade.find(req.query)
          .then(subDocs => {
            if(req.query.type === 'shiti'){
              return res.json({ code: 0, data: {
                first: {
                  label: '试题分类',
                  list: docs
                },
                second: {
                  label: '题型分类',
                  list: subDocs
                }
              }})
            } else if(req.query.type === 'web-content') {
              return res.json({ code: 0, data: {
                first: {
                  label: '一级分类',
                  list: docs
                },
                second: {
                  label: '二级分类',
                  list: subDocs
                }
              }})
            }

            req.query.level = 'third';
            this.facade.find(req.query)
              .then(thirdDocs => {
                return res.json({ code: 0, data: {
                  first: {
                    label: '一级分类',
                    list: docs
                  },
                  second: {
                    label: '二级分类',
                    list: subDocs
                  },
                  third: {
                    label: '三级分类',
                    list: thirdDocs
                  }
                }})
              }).catch(err => next(err))
          }).catch(err => next(err));
        
      }).catch(err => next(err));
  }
}

module.exports = new CategoryController(categoryFacade);
