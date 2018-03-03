const Controller = require('../../lib/controller');
const categoryFacade = require('./facade');
const paperFacade = require('../paper/facade');
const questionFacade = require('../question/facade');
const paperHistoryFacade = require('../paper-history/facade');
const _ = require('lodash');

class CategoryController extends Controller {
  findQuestionDetails(req, res, next) {
    console.log(req.body)
    Promise.all([
      questionFacade.findById(req.body.questionId), 
      paperFacade.findById(req.body.paperId),
      paperHistoryFacade.findOne({ openId: req.body.openId, paperId: req.body.paperId, status: 1 }),
      questionFacade.findNextQuestion(req.body.questionId, req.body.paperId)
    ]).then(([question, paper, paperHistory, nextQuestion]) => {
      const points = (() => {
        let points = 0, progress = 0, idx = 0
        for (let j = 0, len = paper.questions.length; j < len; j++) {
          if (paper.questions[j].id === req.body.questionId) {
            points = paper.questions[j].points 
            progress = j + 1
            idx = j
            break;
          }
        }

        return points
      })()
      const userSelectedAnswer = req.body.userAnswer.split(',')

      if (paperHistory) {
        let notExist = true
        for (let i = 0, len = paperHistory.questionsHistory.length; i < len; i++) {
          if (paperHistory.questionsHistory[i]._id === req.body.questionId) {
            notExist = false;
            paperHistory.questionsHistory[i].userAnswer = userSelectedAnswer
            paperHistory.questionsHistory[i].points = points

            break;
          }
        }

        if (notExist) {
          paperHistory.progress += 1
          const questionObj = JSON.parse(JSON.stringify(question))
          questionObj.points = points
          questionObj.userAnswer = userSelectedAnswer
          paperHistory.questionsHistory.push(questionObj)
        }

        paperHistory.questionSize = paper.questions.length

        console.log('new paper history', paperHistory)

        paperHistoryFacade.update({ _id: paperHistory._id }, {
          questionsHistory: paperHistory.questionsHistory,
          questionSize: paperHistory.questionSize,
          progress: paperHistory.progress
        }).then(result => {
          console.log('update paper history:', result);
          res.json({
            code: 0,
            msg: 'ok!',
            data: nextQuestion
          })
        })
      } else {
        const questionHistory = {
          userAnswer: userSelectedAnswer,
          points: points,
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
        }).then(result => {
          console.log('create paper history:', result);
          res.json({
            code: 0,
            msg: 'ok!',
            data: nextQuestion
          })
        })
      }
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

      Promise.all([questionFacade.findById(paper.questions[0].id), paperHistoryFacade.findOne({ paperId: paper._id, status: 1, openId: req.body.openId })])
        .then(([question, history]) => {
          if(!history) {
            if (question) {
              paper.questions[0].details = question
            }
            res.json({
              code: 0,
              msg: 'ok!',
              data: paper
            })
          } else {
            const resPaper = JSON.parse(JSON.stringify(paper))

            for (let i = 0, len = history.questionsHistory.length; i < len; i++) {
              for (let j = 0, jlen = resPaper.questions.length; j < jlen; j++) {
                if (history.questionsHistory[i]._id == resPaper.questions[j].id) {
                  resPaper.questions[j].details = history.questionsHistory[i]
                  break;
                }
              }
            }

            questionFacade.findById(resPaper.questions[history.progress].id).then(que => {
              resPaper.questions[history.progress].details = que
              res.json({
                code: 0,
                msg: 'ok',
                data: resPaper
              })
            })
          }
        })
    })
  }

  findPaper(req, res, next) {
    paperFacade.find({ 'firstCat.id': req.body.targetId, 'secondCat.id': req.body.subjectId, 'thirdCat.id': req.body.categoryId }).then(paper => {
      const results = [];
      const pArr = [];
      const rArr = [];
      if (paper) {
        
        for (let i = 0, len = paper.length; i < len; i++) {
          pArr.push(paperHistoryFacade.findOne({ paperId: paper[i]._id, openId: req.body.openId, status: 1 }).catch(e => 0))
          rArr.push(`r${i}`)
        }

        Promise.all(pArr).then((rArr) => {
          for(let j = 0, len = rArr.length; j < len; j++) {
            const result = {
              _id: paper[j]._id,
              title: paper[j].title,
              image: paper[j].image
            }

            if (rArr[j] && paper[j].questions.length) {
              result.progress = `${rArr[j].progress}/${paper[j].questions.length}`
              result.lastAnsweredQuestionIndex = rArr[j].progress
              result.percentage = Math.round(rArr[j].progress / paper[j].questions.length * 100)
            } else {
              result.progress = `0/${paper[j].questions.length}`
              result.lastAnsweredQuestionIndex = 0
              result.percentage = 0
            }

            results.push(result)
          }

          res.json({
            code: 0,
            msg: 'ok',
            data: results
          })
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
      const pArr = [];
      const rArr = [];
      for(let i = 0, len = cats.length; i < len; i++) {
        pArr.push(paperFacade.find({ 'thirdCat.id': cats[i]._id, 'firstCat.id': req.body.targetId, 'secondCat.id': req.body.subjectId }).catch(e => 0))
        rArr.push(`r${i}`)
      }

      Promise.all(pArr).then((rArr) => {
        const ppArr = [];
        const rrArr = [];
        const catQuestionSizeArr = []
        for (let j = 0, jLen = rArr.length; j < jLen; j++) {
          const idArr = rArr[j].map(v => v._id)

          let totalLen = 0
          if(rArr[j]) {
            for(let k = 0, klen = rArr[j].length; k < klen; k++) {
              totalLen += rArr[j][k].questions.length
            }
          }
          catQuestionSizeArr.push(totalLen)

          ppArr.push(paperHistoryFacade.find({ paperId: { $in: idArr }, openId: req.body.openId, status: 1 }, 'progress questionSize').catch(e => 0))
          rrArr.push(`rr${j}`)
        }

        Promise.all(ppArr).then((rrArr) => {
          for (let k = 0, kLen = rrArr.length; k < kLen; k++) {
            const result = {
              _id: cats[k]._id,
              name: cats[k].name,
              image: cats[k].image
            }
            if (rrArr[k] && rrArr[k].length) {
              const pr = rrArr[k].reduce((pre, cur) => {
                pre.progress += cur.progress
                pre.questionSize += cur.questionSize
                return pre
              })

              if(catQuestionSizeArr[k]) {
                result.progress = `${pr.progress}/${catQuestionSizeArr[k]}`
                result.percentage = Math.round(pr.progress / catQuestionSizeArr[k] * 100)
              } else {
                result.progress = '0/0'
                result.percentage = 0
              }
            } else {
              result.progress = `0/${catQuestionSizeArr[k]}`
              result.percentage = 0
            }
            results.push(result)
          }

          res.json({
            code: 0,
            msg: 'ok!',
            data: results
          })
        })
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
