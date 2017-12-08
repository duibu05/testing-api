const Controller = require('../../lib/controller');
const userFacade = require('./facade');
const uuid = require('uuid/v4')

class UserController extends Controller {
  signin(req, res, next) {
    this.facade.findOne({ account: req.body.account })
      .then(result => {
        if (result) {
          result.comparePassword(req.body.password, (err, isMatch) => {
            if (err) next(err);
            if (isMatch) {
              delete result.password;
              result.token = uuid();
              this.facade.update({ _id: result._id }, { token: result.token })
                .then(updated => {
                  if(updated.n && updated.nModified) {
                    res.json({
                      code: 0,
                      msg: 'ok',
                      data: { token: result.token },
                    });
                  }
                })
              
            } else {
              res.json({
                code: -1,
                msg: '账号或密码错误！'
              });
            }
          });
        } else {
          res.json({
            code: -1,
            msg: '账号或密码错误！'
          });
        }
      })
  }

  signout(req, res, next) {
    this.facade.update({ token: '' })
      .then(() => {
        res.json({
          code: 0,
          msg: 'ok'
        })
      })
  }

  check(req, res, next) {
    this.facade.findOne({ account: req.body.account })
    .then(user => {
      if(user) {
        res.json({
          code: -1,
          msg: '用户已存在！'
        })
      }
    })
    .catch(err => {
      res.json({
        code: -1,
        msg: '请求异常！'
      })
    })
  }

  create(req, res, next) {
    this.facade.findOne({ account: req.body.account })
      .then(user => {
        if(user) {
          res.json({
            code: -1,
            msg: '用户已存在！'
          })
        }

        this.facade.create(req.body)
          .then(user => {
            res.json({
              code: 0,
              msg: 'ok',
              data: user
            })
          })
          .catch(err => {
            res.json({
              code: -1,
              msg: `请求异常: ${err.message}`
            })
          })
      })
      .catch(err => {
        res.json({
          code: -1,
          msg: `请求异常: ${err.message}`
        })
      })
  }

  resetPwd(req, res, next) {
    this.facade.model.hashPassword(req.body.password).then(result => {
      req.body.password = result;
      this.facade.update({ _id: req.params.id }, req.body)
      .then((results) => {
        if (results.n < 1) { return res.json({code: -1, msg: '无相应记录！'}); }
        if (results.nModified < 1) { return res.json({code: -1, msg: '修改失败！'}); }
        res.json({ code: 0, msg: 'ok' });
      })
      .catch(err => next(err));
    });
  }
}

module.exports = new UserController(userFacade);
