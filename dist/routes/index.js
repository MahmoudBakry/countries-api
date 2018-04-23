"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _user = require("./user.route");

var _user2 = _interopRequireDefault(_user);

var _country = require("./country.route");

var _country2 = _interopRequireDefault(_country);

var _city = require("./city.route");

var _city2 = _interopRequireDefault(_city);

var _region = require("./region.route");

var _region2 = _interopRequireDefault(_region);

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import seenRouter from './seenCount.route'
var requireAuth = _passport2.default.authenticate('jwt', { session: false });
var router = _express2.default.Router();
router.use("/", _user2.default);
router.use("/countries", _country2.default);
//this protected by token ==> private
exports.default = router;
//# sourceMappingURL=index.js.map