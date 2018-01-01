const controller = require('./controller');
const Router = require('express').Router;
const join = require('../joiner/router');
const router = new Router();

router.use('/join', join)

router.route('/index').get((...args) => controller.index(...args));

router.route('/about-us').get((...args) => controller.aboutUs(...args));

router.route('/teacher-qualification').get((...args) => controller.teacherQE(...args));

router.route('/juducial-exam').get((...args) => controller.juducialExam(...args));

router.route('/lesson-details/:id').get((...args) => controller.lessonDetails(...args));

router.route('/news').get((...args) => controller.news(...args));

router.route('/news-details/:id').get((...args) => controller.newsDetails(...args));

router.route('/web-content').get((...args) => controller.webContent(...args));

router.route('/web-content-details/:id').get((...args) => controller.webContentDetails(...args));
module.exports = router;
