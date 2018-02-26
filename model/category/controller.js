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
      const points = (() => {
        let points = 0, progress = 0
        for (let j = 0, len = paper.questions.length; j < len; j++) {
          if (paper.questions[j].id === req.body.questionId) {
            points = paper.questions[j].points 
            progress = j + 1
            break;
          }
        }

        return points
      })()
      const userSelectedAnswer = req.body.userAnswer.split(',')

      if (paperHistory) {
        for (let i = 0, len = paperHistory.questionsHistory.length; i < len; i++) {
          if (paperHistory.questionsHistory[i].id === req.body.questionId) {
            paperHistory.questionsHistory[i].userAnswer = userSelectedAnswer
            paperHistory.questionsHistory[i].points = points
            paperHistory.questionSize = paper.questions.length
            paperHistory.progress = paperHistory.progress > progress ? paperHistory.progress : progress

            break;
          }
        }
        paperHistoryFacade.update({ _id: paperHistory._id }, {
          questionsHistory: paperHistory.questionsHistory,
          questionSize: paperHistory.questionSize,
          progress: questionHistory.progress
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
            }

            if (rArr[j]) {
              result.progress = `${rArr[j].progress}/${rArr[j].questionSize}`
              result.percentage = Math.round(rArr[j].progress / rArr[j].questionSize * 100)
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
        pArr.push(paperFacade.find({ 'thirdCat.id': cats[i]._id }, '_id').catch(e => 0))
        rArr.push(`r${i}`)
      }

      Promise.all(pArr).then((rArr) => {
        const ppArr = [];
        const rrArr = [];
        for (let j = 0, jLen = rArr.length; j < jLen; j++) {
          const idArr = rArr[j].map(v => v._id)
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

              result.progress = `${pr.progress}/${pr.questionSize}`,
              result.percentage = Math.round(pr.progress / pr.questionSize * 100)
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
