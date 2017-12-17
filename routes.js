const Router = require('express').Router;
const router = new Router();

const user = require('./model/user/router');
const qiniuToken = require('./model/qiniu-uptoken/router');
const joiner = require('./model/joiner/router');
const news = require('./model/news/router');
const sideBar = require('./model/side-bar/router');
const aboutUs = require('./model/about-us/router');
const wechatContent = require('./model/wechat-content/router');
const category = require('./model/category/router');
const question = require('./model/question/router');
const paper = require('./model/paper/router');

/**
 * clear empty param in req.query
 */

router.use((req, res, next) => {
  const propNames = Object.getOwnPropertyNames(req.query);
  for (let i = 0, len = propNames.length; i < len; i++) {
    const propName = propNames[i];
    if (req.query[propName] === '' || req.query[propName] === null || req.query[propName] === undefined) {
      delete req.query[propName];
    }
  }
  next();
})

router.use((req, res, next) => {
  setTimeout(() => {
    next();
  }, 200);
});

router.route('/api').get((req, res) => {
  res.json({ message: 'Welcome to testing-api API!' });
});

router.route('/api/*').options((req, res) => {
  res.status(204).end();
});

router.use('/api/users?', user);
router.use('/api/category?(ies)?', category);
router.use('/api/qiniu-uptokens?', qiniuToken);
router.use('/api/joiners?', joiner);
router.use('/api/questions?', question);
router.use('/api/papers?', paper);
router.use('/api/news', news);
router.use('/api/side-bar', sideBar);
router.use('/api/about-us', aboutUs);
router.use('/api/wechat-contents?', wechatContent);

router.use((err, req, res, next) => {
  res.status(200).json({
    code: -1,
    msg: err.message
  })
})

module.exports = router;

