const Controller = require('../../lib/controller');
const categoryFacade = require('./facade');

class CategoryController extends Controller {}

module.exports = new CategoryController(categoryFacade);
