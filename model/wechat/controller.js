const _ = require('lodash');
const Controller = require('../../lib/controller');
const wechatFacade = require('./facade');
// const categoryFacade = require('../category/facade');
const historyFacade = require('../history/facade');
const wechatUserFacade = require('../wechat-user/facade');
const carouselMgmtFacade = require('../carousel-mgmt/facade');
// const wechatContentFacade = require('../wechat-content/facade');
const aboutUsFacade = require('../about-us/facade');
const config = require('../../config');
const request = require('request');

class WechatController extends Controller {
  index(req, res, next) {
    const pArr = [carouselMgmtFacade.find({ page: 'wechatIndex' }), wechatUserFacade.findOne({ openId: req.body.openId })]
    Promise.all(pArr)
      .then(([p1, p2]) => {
        const data = {
          recommended: _.groupBy(p1, 'cat')
        }
        if (p2) {
          data.userinfo = p2;
          historyFacade.findOne({ openId: req.body.openId }).then(history => {
              data.history = history || {
                "questionSize": 0,
                "correctRate": "0%"
              };
              
              res.status(200).json({
                code: 0,
                msg: 'ok',
                data: data
              })
            }).catch(err => next(err));
        } else {
          data.userinfo = {};
          data.history = {
            "questionSize": 0,
            "correctRate": "0%"
          };
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

  getOpenId(req, res, next) {
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${config.mapp.mappid}&secret=${config.mapp.secret}&js_code=${req.body.code}&grant_type=authorization_code`;
    request.get(url, (error, response, body) => {
      body = JSON.parse(body);
      if (error) {
        return res.json({
          code: -1,
          msg: '请求失败，请稍后重试！'
        });
      }

      if (body.errcode) {
        return res.json({
          code: -1,
          msg: '请求失败！',
          data: body
        });
      }

      wechatUserFacade.find({ openId: body.openid }).then(user => {
        const result = _.assign({}, body)
        result.openId = body.openid
        
        result.hasBind = false
        
        if(user && user.length) {
          result.hasBind = true
        }

        res.json({
          code: 0,
          msg: 'ok',
          data: result
        });
      })
    });
  }
}

module.exports = new WechatController(wechatFacade);
