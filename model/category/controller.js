const Controller = require('../../lib/controller');
const categoryFacade = require('./facade');

class CategoryController extends Controller {
  findByTypeAndRebuildDate(req, res, next) {
    this.facade.find(req.query)
      .then(docs => {
        if(req.query.type === 'wechat-content')
        res.json({ code: 0, data: {
          first: {
            label: '微信小程序分类管理',
            list: docs
          }
        } })
      })
  }
}

module.exports = new CategoryController(categoryFacade);
