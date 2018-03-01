const controller = require('./controller');
const Router = require('express').Router;
const wechatContent = require('../wechat-content/facade');
const wechatUser = require('../wechat-user/facade');
const lesson = require('../lesson/facade');
const router = new Router();

const dealWithParams = function(req, res, next) {
  if (req.body.from === 'mapp') {
    req.body.from = '微信';
    if (req.body.joinIn) {
      wechatContent.findById(req.body.joinIn).then(doc => {
        if(doc) {
          req.body.joinIn = {
            sn: doc._id,
            category: doc.catName,
            name: doc.title,
            post: doc.post
          }

          if (req.body.openId) {
            wechatUser.findOne({ openId: req.body.openId }).then(user => {
              if(user) {
                req.body.name = user.nickname
                req.body.cellphone = user.cellphone
              } else {
                next(new Error('用户不存在，可能未绑定！！！'));
              }
  
              next();
            });
          } else {
            next(new Error('openId不能为空！！！'));
          }
        }
      }).catch(err => next(err));
    }
  } else {
    req.body.from = '网站';
    if (req.body.joinIn) {
      lesson.findById(req.body.joinIn).then(doc => {
        if(doc) {
          req.body.joinIn = {
            sn: doc._id,
            category: doc.cat,
            name: doc.title,
            post: doc.post
          }
        }
        next();
      }).catch(err => next(err));
    }
  }
}

router.route('/')
  .get((...args) => controller.find(...args))
  .post((...args) => dealWithParams(...args), (...args) => controller.create(...args));

router.route('/myLesson')
  .post((...args) => controller.find(...args));

router.route('/:id')
  .put((...args) => controller.update(...args))
  .get((...args) => controller.findById(...args))
  .delete((...args) => controller.remove(...args));

module.exports = router;
