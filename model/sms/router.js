const controller = require('./controller');
const Router = require('express').Router;
const router = new Router();
const RateLimit = require('express-rate-limit');

const sendSMSLimiter = new RateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,
  delayMs: 0, // disabled
  message: '请求过于频繁，请稍后重试！'
});

router.route('/')
  .post(sendSMSLimiter, (...args) => controller.sendSMS(...args));

module.exports = router;
