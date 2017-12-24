const Router = require('express').Router;
const router = new Router();

const user = require('./model/user/router');
const qiniuToken = require('./model/qiniu-uptoken/router');
const joiner = require('./model/joiner/router');
const news = require('./model/news/router');
const sideBar = require('./model/side-bar/router');
const aboutUs = require('./model/about-us/router');
const wechatContent = require('./model/wechat-content/router');
const wechatUser = require('./model/wechat-user/router');
const category = require('./model/category/router');
const question = require('./model/question/router');
const paper = require('./model/paper/router');
const lesson = require('./model/lesson/router');
const webContent = require('./model/web-content/router');
const carouselMgmt = require('./model/carousel-mgmt/router')
const website = require('./model/website/router')

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

router.route('/v1').get((req, res) => {
  res.json({ message: 'Welcome to testing-api API!' });
});

router.route('/v1/*').options((req, res) => {
  res.status(204).end();
});

router.use('/v1/users?', user);
router.use('/v1/category?(ies)?', category);
router.use('/v1/qiniu-uptokens?', qiniuToken);
router.use('/v1/joiners?', joiner);
router.use('/v1/questions?', question);
router.use('/v1/papers?', paper);
router.use('/v1/news', news);
router.use('/v1/lessons?', lesson);
router.use('/v1/side-bar', sideBar);
router.use('/v1/about-us', aboutUs);
router.use('/v1/wechat-contents?', wechatContent);
router.use('/v1/wechat-users?', wechatUser);
router.use('/v1/web-contents?', webContent);
router.use('/v1/recommended-mgmts?', carouselMgmt);
router.use('/v1/website?', website);

router.use((err, req, res, next) => {
  res.status(200).json({
    code: -1,
    msg: err.message
  })
})

module.exports = router;

