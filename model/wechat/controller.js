const _ = require('lodash');
const Controller = require('../../lib/controller');
const wechatFacade = require('./facade');
const categoryFacade = require('../category/facade');
const historyFacade = require('../history/facade');
const wechatUserFacade = require('../wechat-user/facade');
const carouselMgmtFacade = require('../carousel-mgmt/facade');
const wechatContentFacade = require('../wechat-content/facade');
const aboutUsFacade = require('../about-us/facade');

class WechatController extends Controller {
  index(req, res, next) {
    const pArr = [carouselMgmtFacade.find({ page: 'wechatIndex' }), wechatUserFacade.findOne({ phone: req.params.openId })]
    Promise.all(pArr)
      .then(([p1, p2]) => {
        const data = {
          recommended: _.groupBy(p1, 'cat')
        }
        if (p2) {
          data.userinfo = p2;
          Promise.all([historyFacade.count({ openId: req.params.openId }), historyFacade.count({ openId: req.params.openId, status: 1 })])
            .then(([p3, p4]) => {
              data.history = {
                total : p3
              };
              if (p3) {
                data.history.correctRate = Math.round(p4 / p3 * 100) + '%';
              } else {
                data.history.correctRate = '-';
              }
              res.status(200).json({
                code: 0,
                msg: 'ok',
                data: data
              })
            }).catch(err => next(err));
        } else {
          data.userinfo = {};
          res.status(200).json({
            code: 0,
            msg: 'ok',
            data: data
          })
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
}

module.exports = new WechatController(wechatFacade);
