const Controller = require('../../lib/controller');
const categoryFacade = require('./facade');
const paperFacade = require('../paper/facade');
const questionFacade = require('../question/facade');
const paperHistoryFacade = require('../paper-history/facade');
const wrongQuestionFacade = require('../wrong-question/facade');
const _ = require('lodash');

class CategoryController extends Controller {
  findQuestionDetails(req, res, next) {
    let point = 0, progress = 0, idx = 0, nextQuestionId = '';
    Promise.all([
      questionFacade.findById(req.body.questionId), 
      paperFacade.findById(req.body.paperId),
      paperHistoryFacade.findOne({ openId: req.body.openId, paperId: req.body.paperId, status: 1 }),
    ]).then(([question, paper, paperHistory]) => {
      const points = (() => {
        for (let j = 0, len = paper.questions.length; j < len; j++) {
          if (paper.questions[j].id === req.body.questionId) {
            point = paper.questions[j].points
            nextQuestionId = paper.questions[j + 1].id
            progress = j + 1
            idx = j
            break;
          }
        }

        return point
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

        paperHistoryFacade.update({ _id: paperHistory._id }, {
          questionsHistory: paperHistory.questionsHistory,
          questionSize: paperHistory.questionSize,
          progress: paperHistory.progress
        }).then(result => {
          questionFacade.findById(nextQuestionId).then(nextQuestion => {
            res.json({
              code: 0,
              msg: 'ok!',
              data: nextQuestion
            })
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
          questionFacade.findById(nextQuestionId).then(nextQuestion => {
            res.json({
              code: 0,
              msg: 'ok!',
              data: nextQuestion
            })
          })
        })
      }
    });
  }

  commitWrongPaper(req, res, next) {
    const userAnswer = req.body.currentUserAnswer.split(',')
    wrongQuestionFacade.findById(req.body.wrongPaperId).then(paper => {
      if (!paper) return res.json({ code: -1, msg: 'empty paper', data: {} })
      let userScore = 0, questionSize = 0, right = 0;
      const wrongQuestions = paper.questionsHistory.filter(v => {
        if (req.body.currentQuestionId === questions[i].id) {
          questions[i].userAnswer = userAnswer
        }
        questionSize += 1
        if (v.userAnswer.sort().join(',') === v.rightAnswer.sort().join(',')) {
          userScore += +(questions[i].points || 0)
          right += 1
          return false
        }
        return true
      })

      if (wrongQuestions && wrongQuestions.length) {
        wrongQuestionFacade.update({ _id: req.body.wrongPaperId }, {
          paperId: req.body.wrongPaperId,
          title: paper.title,
          image: paper.image,
          score: 0,
          progress: 0,
          questionSize: wrongQuestions.length,
          questionsHistory: wrongQuestions,
          status: 1, // 1-undone 2-done
          openId: paper.openId
        }).then(result => {
          res.json({
            code: 0,
            msg: 'ok',
            data: {
              statistics: {
                correctRate: Math.round(right / questionSize * 100) + '%',
                questionSize: questionSize
              },
              score: userScore,
            }
          })
        })
      } else {
        wrongQuestionFacade.remove({ _id: req.body.wrongPaperId }).then(result => {
          res.json({
            code: 0,
            msg: 'ok',
            data: {
              statistics: {
                correctRate: Math.round(right / paper.questions.length * 100) + '%',
                questionSize: paper.questions.length
              },
              score: userScore,
            }
          })
        })
      }
    })
    
  }

  submitWrongQuestionUserAnswer(req, res, next) {
    const userAnswer = req.body.currentUserAnswer.split(',')
    wrongQuestionFacade.findById(req.body.wrongPaperId).then(doc => {
      let index = 0;
      for (let i = 0, len = doc.questionsHistory.length; i < len; i++) {
        if (doc.questionsHistory[i].id === req.body.currentQuestionId) {
          doc.questionsHistory[i].userAnswer = userAnswer
          index = i + 1
          break;
        }
      }
      if (doc.progress < index) {
        doc.progress = index
      }

      wrongQuestionFacade.update({ _id: req.body.wrongPaperId }, {
        progress: doc.progress,
        questionsHistory: doc.questionsHistory,
      }).then(result => {
        return res.json({
          code: 0,
          msg: 'ok',
          data: result
        })
      })
    })
  }

  findWrongPaperDetails(req, res, next) {
    wrongQuestionFacade.findById(req.body.wrongPaperId).then(doc => {
      res.json({
        code: 0,
        msg: 'ok',
        data: doc
      })
    })
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

  findWrongPaper(req, res, next) {
    wrongQuestionFacade.find({ paperId: { $in: (req.body.wrongPaperIdArr || '').split(',') }, openId: req.body.openId, status: 1 }, 'title image questionSize progress').then(papers => {
      res.json({
        code: 0,
        msg: 'ok',
        data: papers
      })
    })
  }

  findPaper(req, res, next) {
    paperFacade.find({ 'firstCat.id': req.body.targetId, 'secondCat.id': req.body.subjectId, 'thirdCat.id': req.body.categoryId, 'fourthCat.id': req.body.subCategoryId }).then(paper => {
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
    categoryFacade.find({ type: 'shijuan', level: 'second', 'first._id': req.body.targetId }, 'name image').then(subjects => {
      res.json({
        code: 0,
        msg: 'ok!',
        data: subjects
      })
    })
  }

  findCategory(req, res, next) {
    categoryFacade.find({ type: 'shijuan', level: 'third', 'first._id': req.body.targetId, 'second._id': req.body.subjectId }, 'name image').then(categories => {
      res.json({
        code: 0,
        msg: 'ok!',
        data: categories
      })
    })
  }

  findSubCategory(req, res, next) {
    const paperIdArray = [];
    categoryFacade.find({ type: 'shijuan', level: 'fourth', 'first._id': req.body.targetId, 'second._id': req.body.subjectId, 'third._id': req.body.categoryId },  'name image').then(cats => {
      const results = [];
      const pArr = [];
      const rArr = [];
      for(let i = 0, len = cats.length; i < len; i++) {
        pArr.push(paperFacade.find({ 'fourthCat.id': cats[i]._id, 'firstCat.id': req.body.targetId, 'secondCat.id': req.body.subjectId, 'thirdCat.id': req.body.categoryId }).catch(e => 0))
        rArr.push(`r${i}`)
      }

      Promise.all(pArr).then((rArr) => {
        const ppArr = [];
        const rrArr = [];
        const catQuestionSizeArr = []
        for (let j = 0, jLen = rArr.length; j < jLen; j++) {
          const idArr = rArr[j].map(v => {
            paperIdArray.push(v._id)
            return v._id
          })
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

          wrongQuestionFacade.find({ paperId: { $in: paperIdArray }, openId: req.body.openId, status: 1 }).then(wrong => {
            let wrongLen = 0
            let wrongProgress = 0
            for (let w = 0, wlen = wrong.length; w < wlen; w++) {
              wrongLen += wrong[w].questionsHistory.length
              wrongProgress += wrong[w].progress
            }

            results.push({
              _id: 'wrong',
              type: 'wrong',
              wrongPaperIdArr: paperIdArray.join(','),
              name: '我的错题',
              image: 'https://cdn.gdpassing.com/FtBnhBVsFYgH3Ubeeq6PIHeahrgI',
              progress: `${wrongProgress}/${wrongLen}`,
              percentage: wrongLen !== 0 ? Math.round(wrongProgress / wrongLen * 100) : 0
            })

            res.json({
              code: 0,
              msg: 'ok!',
              data: results
            })
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
            Promise.all([
              this.facade.find(req.query),
              this.facade.find({ level: 'fourth' })
            ]).then(([thirdDocs, fourthDocs]) => {
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
                  },
                  fourth: {
                    label: '四级分类',
                    list: fourthDocs
                  }
                }})
              }).catch(err => next(err))
          }).catch(err => next(err));
        
      }).catch(err => next(err));
  }
}

module.exports = new CategoryController(categoryFacade);
