const controller = require('./controller');
const Router = require('express').Router;
const wechatContent = require('../wechat-content/router');
const wechatUser = require('../wechat-user/router');
const join = require('../joiner/router');
const category = require('../category/router');
const sms = require('../sms/router');
const paper = require('../paper/router');
const paperHistory = require('../paper-history/router');
const router = new Router();

router.route('/')
  .get((...args) => controller.find(...args))
  .post((...args) => controller.create(...args));

router.route('/index')
  .post((...args) => controller.index(...args));

router.use('/content', wechatContent);
router.use('/join', join);
router.use('/sms', sms);

router.use('/user', wechatUser);
router.use('/question-bank', category);
router.use('/paper', paper);
router.use('/history', paperHistory);

router.route('/about-us')
  .post((...args) => controller.aboutUs(...args));

router.route('/:id')
  .put((...args) => controller.update(...args))
  .get((...args) => controller.findById(...args))
  .delete((...args) => controller.remove(...args));

router.route('/getOpenId')
  .post((...args) => controller.getOpenId(...args));

module.exports = router;
