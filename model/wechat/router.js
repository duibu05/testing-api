const controller = require('./controller');
const Router = require('express').Router;
const wechatContent = require('../wechat-content/router');
const join = require('../joiner/router');
const sms = require('../sms/router');
const router = new Router();

router.route('/')
  .get((...args) => controller.find(...args))
  .post((...args) => controller.create(...args));

router.route('/index')
  .post((...args) => controller.index(...args));

router.use('/content', wechatContent);
router.use('/join', join);
router.use('/sms', sms);

router.route('/about-us')
  .post((...args) => controller.aboutUs(...args));

router.route('/:id')
  .put((...args) => controller.update(...args))
  .get((...args) => controller.findById(...args))
  .delete((...args) => controller.remove(...args));

router.route('/getOpenId')
  .post((...args) => controller.getOpenId(...args));

module.exports = router;
