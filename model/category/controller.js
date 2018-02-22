const Controller = require('../../lib/controller');
const categoryFacade = require('./facade');
const paperFacade = require('../paper/facade');

class CategoryController extends Controller {
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
      for(let i = 0, len = cats.length; i < len; i++) {
        cats[i].score = '13/355'
      }

      res.json({
        code: 0,
        msg: 'ok!',
        data: cats
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
