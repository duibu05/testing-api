const _ = require('lodash');
const moment = require('moment');
const Controller = require('../../lib/controller');
const websiteIndexFacade = require('./facade');
const carouselMgmtFacade = require('../carousel-mgmt/facade');
const newsFacade = require('../news/facade');
const lessonFacade = require('../lesson/facade');
const categoryFacade = require('../category/facade');
const sidebarFacade = require('../side-bar/facade');
const aboutUsFacade = require('../about-us/facade');
const webContentFacade = require('../web-content/facade');


class WebsiteIndexController extends Controller {
  index(req, res, next) {
    Promise.all([carouselMgmtFacade.find({ page: 'webIndex' }), newsFacade.find({ page: 1, limit: 6, sort: '-timestamp' }), sidebarFacade.find({ page: 1, limit: 1 })])
      .then(([p1, p2, p3]) => {
        const p2Obj = JSON.parse(JSON.stringify(p2))
        const data = {
          recommended: _.groupBy(p1, 'cat'),
          newsList: p2Obj.filter(v => {
            v.createdAt = moment(new Date(v.createdAt)).format('YYYY-MM-DD HH:mm');
            return true
          }),
          sidebar: p3
        }

        if (data.recommended.carousels && data.recommended.carousels.length) {
          const hasWebContent = data.recommended.carousels.filter(v => v.type === 'web-content').map(v => v.target_id)
          if (hasWebContent && hasWebContent.length) {
            webContentFacade.find({_id : {$in: hasWebContent}}).then(contents => {
              data.recommended.carousels.forEach(v => {
                if (v.type === 'web-content') {
                  const content = contents.filter(d => d._id = v.target_id)
                  if (content && content.length) {
                    v.cat = content[0].cat || ''
                  }
                }
              })

              res.status(200).json({
                code: 0,
                msg: 'ok',
                data: data
              })
            })
          } else {
            res.status(200).json({
              code: 0,
              msg: 'ok',
              data: data
            })
          }
        }
      }).catch(err => {
        next(err);
      })
  }

  aboutUs(req, res, next) {
    aboutUsFacade.find({ page: 1, limit: 1 }).then(docs => {
      res.json({
        code: 0,
        msg: 'ok',
        data: docs[0]
      })
    }).catch(err => next(err))
  }

  teacherQE(req, res, next) {
    Promise.all([categoryFacade.find({ type: 'web-content', level: 'second' }), carouselMgmtFacade.find({ page: 'teacherQE' }), lessonFacade.find({ cat: '教师资格', page: 1, limit: 3 })])
      .then(([p1, p2, p3]) => {
        const p3Obj = JSON.parse(JSON.stringify(p3))
        const data = {
          recommended: _.groupBy(p2, 'cat'),
          categoryList: p1,
          lesson: p3Obj.filter(v => {
            v.createdAt = moment(new Date(v.createdAt)).format('YYYY-MM-DD HH:mm');
            v.startTime = moment(new Date(v.startTime)).format('YYYY-MM-DD HH:mm');
            return true
          })
        }
        if (data.recommended.carousels && data.recommended.carousels.length) {
          const hasWebContent = data.recommended.carousels.filter(v => v.type === 'web-content').map(v => v.target_id)
          if (hasWebContent && hasWebContent.length) {
            webContentFacade.find({_id : {$in: hasWebContent}}).then(contents => {
              data.recommended.carousels.forEach(v => {
                if (v.type === 'web-content') {
                  const content = contents.filter(d => d._id = v.target_id)
                  if (content && content.length) {
                    if (content && content.length) {
                    v.cat = content[0].cat || ''
                  }
                  }
                }
              })

              res.status(200).json({
                code: 0,
                msg: 'ok',
                data: data
              })
            })
          } else {
            res.status(200).json({
              code: 0,
              msg: 'ok',
              data: data
            })
          }
        }
      }).catch(err => next(err))
  }

  juducialExam(req, res, next) {
    Promise.all([categoryFacade.find({ type: 'web-content', level: 'second' }), carouselMgmtFacade.find({ page: 'juducialExam' }), lessonFacade.find({ cat: '司法考试', page: 1, limit: 3 })])
      .then(([p1, p2, p3]) => {
        const p3Obj = JSON.parse(JSON.stringify(p3))
        const data = {
          recommended: _.groupBy(p2, 'cat'),
          categoryList: p1,
          lesson: p3Obj.filter(v => {
            v.createdAt = moment(new Date(v.createdAt)).format('YYYY-MM-DD HH:mm');
            v.startTime = moment(new Date(v.startTime)).format('YYYY-MM-DD HH:mm');
            return true
          })
        }
        if (data.recommended.carousels && data.recommended.carousels.length) {
          const hasWebContent = data.recommended.carousels.filter(v => v.type === 'web-content').map(v => v.target_id)
          if (hasWebContent && hasWebContent.length) {
            webContentFacade.find({_id : {$in: hasWebContent}}).then(contents => {
              data.recommended.carousels.forEach(v => {
                if (v.type === 'web-content') {
                  const content = contents.filter(d => d._id = v.target_id)
                  if (content && content.length) {
                    v.cat = content[0].cat || ''
                  }
                }
              })

              res.status(200).json({
                code: 0,
                msg: 'ok',
                data: data
              })
            })
          } else {
            res.status(200).json({
              code: 0,
              msg: 'ok',
              data: data
            })
          }
        }
      }).catch(err => next(err))
  }

  lessonDetails(req, res, next) {
    lessonFacade.findById(req.params.id).then(result => {
      const doc = JSON.parse(JSON.stringify(result))
      doc.createdAt = moment(new Date(doc.createdAt)).format('YYYY-MM-DD HH:mm');
      doc.startTime = moment(new Date(doc.startTime)).format('YYYY-MM-DD HH:mm');
      if (doc.releatedLesson.length) {
        lessonFacade.find({ _id: { $in: doc.releatedLesson } }).then(lessons => {
          doc.releatedLesson = lessons
          return res.json({
            code: 0,
            msg: 'ok',
            data: doc
          })
        }).catch(err => next(err))
      } else {
        res.json({
          code: 0,
          msg: 'ok',
          data: doc
        })
      }
    }).catch(err => next(err))
  }

  news(req, res, next) {
    newsFacade.count({}).then(result => {
      if (result) {
        newsFacade.find(req.query).then(news => {
          const docs = JSON.parse(JSON.stringify(news))
          res.json({
            code: 0,
            msg: 'ok',
            data: {
              list: docs.filter(v => {
                v.createdAt = moment(new Date(v.createdAt)).format('YYYY-MM-DD HH:mm');
                return true
              }),
              totalCount: result
            }
          })
        }).catch(err => next(err))
      } else {
        res.json({
          code: 0,
          msg: 'ok',
          data: []
        })
      }
    })
  }

  newsDetails(req, res, next) {
    newsFacade.findById(req.params.id)
      .then(news => {
        const doc = JSON.parse(JSON.stringify(news))
        if (doc.attachments) {
          const arr = []
          Object.keys(doc.attachments).forEach(v => {
            arr.push({
              name: doc.attachments[v].name,
              url: `https://cdn.gdpassing.com/${doc.attachments[v].url}?attname=${encodeURIComponent(doc.attachments[v].name)}`
            })
          })

          doc.attachments = arr
        }

        doc.createdAt = moment(new Date(doc.createdAt)).format('YYYY-MM-DD HH:mm');
        res.json({
          code: 0,
          msg: 'ok',
          data: doc
        })
      }).catch(err => next(err))
  }

  webContent(req, res, next) {
    webContentFacade.count({ cat: req.query.cat, subCat: req.query.subCat }).then(result => {
      if (result) {
        webContentFacade.find(req.query).then(contents => {
          const docs = JSON.parse(JSON.stringify(contents));
          res.json({
            code: 0,
            msg: 'ok',
            data: {
              list: docs.filter(v => {
                v.createdAt = moment(new Date(v.createdAt)).format('YYYY-MM-DD HH:mm');
                return true
              }),
              totalCount: result
            }
          })
        }).catch(err => next(err))
      } else {
        res.json({
          code: 0,
          msg: 'ok',
          data: []
        })
      }
    })
  }

  webContentDetails(req, res, next) {
    webContentFacade.findById(req.params.id).then(content => {
      const doc = JSON.parse(JSON.stringify(content))
      if (doc.attachments) {
        const arr = []
        Object.keys(doc.attachments).forEach(v => {
          arr.push({
            name: doc.attachments[v].name,
            url: `https://cdn.gdpassing.com/${doc.attachments[v].url}?attname=${encodeURIComponent(doc.attachments[v].name)}`
          })
        })

        doc.attachments = arr
      }
      doc.createdAt = moment(new Date(doc.createdAt)).format('YYYY-MM-DD HH:mm');
      res.json({
        code: 0,
        msg: 'ok',
        data: doc
      })
    }).catch(err => next(err))
  }
}

module.exports = new WebsiteIndexController(websiteIndexFacade);
