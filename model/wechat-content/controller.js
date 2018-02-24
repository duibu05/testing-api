const Controller = require('../../lib/controller');
const wechatContentFacade = require('./facade');
const moment = require('moment');

class WechatContentController extends Controller {
    find(req, res, next) {
        const data = {
          page: req.body.page,
          limit: req.body.limit || 20,
          cat: req.body.cat
        };
        this.facade.count(data)
          .then(rows => {
            if (rows > 0) {
              const pageCount = Math.ceil(rows / +data.limit)
              this.facade.find(data)
                .then(collection => {
                  if (req.body.original && req.body.original === 'mapp') {
                    for(let i = 0, len = collection.length; i < len; i++) {
                      collection[i].content = collection[i].content.replace(/<[^>]+>/g,"").substr(0,15);
                      collection[i].createdAt = moment(collection[i].createdAt).format('YYYY/MM/DD')
                    }
                  }
                  res.status(200).json({
                    code: 0, 
                    data: {
                      list: collection,
                      total: rows,
                      pageCount: pageCount
                    }
                  })
                })
                .catch(err => next(err));
            } else {
              res.status(200).json({
                code: 0,
                data: {
                  list: [],
                  total: 0,
                  pageCount: 0
                },
              })
            }
          })
          .catch(err => next(err));
      }
}

module.exports = new WechatContentController(wechatContentFacade);
