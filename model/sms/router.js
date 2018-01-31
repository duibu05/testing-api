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

const validParams = (req, res, next) => {
  if (req.body.phone) {
    next();
  } else {
    next(new Error('手机号不能为空'));
  }
};

router.route('/')
  .post(validParams, sendSMSLimiter, (...args) => controller.sendSMS(...args));

module.exports = router;
