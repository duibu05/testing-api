const Controller = require('../../lib/controller');
const roleFacade = require('./facade');
const userFacade = require('../user/facade')

class RoleController extends Controller {
  update(req, res, next) {
    this.facade.update({ _id: req.params.id }, req.body)
      .then((results) => {
        if (results.n < 1) { return res.sendStatus(404); }
        if (results.nModified < 1) { return res.sendStatus(304); }
        userFacade.update({ 'role.name': req.body.name }, { $set: { 'role.name': req.body.name } });
        res.json({code: 0, data: results});
      })
      .catch(err => next(err));
  }
}

module.exports = new RoleController(roleFacade);
