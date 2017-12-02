const Router = require('express').Router;
const router = new Router();

const user = require('./model/user/router');
const qiniuToken = require('./model/qiniu-uptoken/router');
const joiner = require('./model/joiner/router');

router.route('/api').get((req, res) => {
  res.json({ message: 'Welcome to testing-api API!' });
});

router.route('/api/*').options((req, res) => {
  res.status(204).end();
});

router.use('/api/users?', user);
router.use('/api/qiniu-uptokens?', qiniuToken);
router.use('/api/joiners?', user);

module.exports = router;

