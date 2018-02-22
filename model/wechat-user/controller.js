const Controller = require('../../lib/controller');
const wechatUserFacade = require('./facade');

class WechatUserController extends Controller {
  updateSign(req, res, next) {
    wechatUserFacade.update({ openId: req.body.openId }, req.body).then(result => {
      res.json({
        code: 0,
        msg: 'ok！'
      })
    })
  }
}

module.exports = new WechatUserController(wechatUserFacade);
