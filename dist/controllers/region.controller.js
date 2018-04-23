"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _city = require("../models/city.model");

var _city2 = _interopRequireDefault(_city);

var _region = require("../models/region.model");

var _region2 = _interopRequireDefault(_region);

var _ApiError = require("../helpers/ApiError");

var _ApiError2 = _interopRequireDefault(_ApiError);

var _check = require("express-validator/check");

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
    validateBody: function validateBody() {
        var _this = this;

        var isUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        return [(0, _check.body)("name").exists().withMessage("name is required")
        //check in unquiness of country name
        .custom(function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(value, _ref2) {
                var req = _ref2.req;
                var nameRegion, region;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                nameRegion = { name: value };

                                if (isUpdate && req.user.name === value) userQuery._id = { $ne: req.user._id };

                                _context.next = 4;
                                return _region2.default.findOne(nameRegion).where('city').equals(req.params.cityId);

                            case 4:
                                region = _context.sent;

                                if (!region) {
                                    _context.next = 9;
                                    break;
                                }

                                throw new Error('region name already exists');

                            case 9:
                                return _context.abrupt("return", true);

                            case 10:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, _this);
            }));

            return function (_x2, _x3) {
                return _ref.apply(this, arguments);
            };
        }())];
    },

    //creatre new region logic
    createRegion: function createRegion(req, res, next) {
        var _this2 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var validationErrors, newRegion, createdRegion, response;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            if (!(req.user.type == "ADMIN")) {
                                _context2.next = 18;
                                break;
                            }

                            validationErrors = (0, _check.validationResult)(req).array();

                            if (!(validationErrors.length > 0)) {
                                _context2.next = 4;
                                break;
                            }

                            return _context2.abrupt("return", next(new _ApiError2.default(422, validationErrors)));

                        case 4:
                            _context2.prev = 4;
                            newRegion = {
                                name: req.body.name,
                                city: req.params.cityId
                            };
                            _context2.next = 8;
                            return _region2.default.create(newRegion);

                        case 8:
                            createdRegion = _context2.sent;
                            _context2.next = 11;
                            return _region2.default.findById(createdRegion).populate({
                                path: 'city',
                                populate: {
                                    path: 'country',
                                    model: 'country'
                                }
                            });

                        case 11:
                            response = _context2.sent;
                            return _context2.abrupt("return", res.status(201).json(response));

                        case 15:
                            _context2.prev = 15;
                            _context2.t0 = _context2["catch"](4);

                            next(_context2.t0);

                        case 18:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2, [[4, 15]]);
        }))();
    },


    //all cities logic 
    allRegions: function allRegions(req, res, next) {
        var _this3 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var id, regions;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            id = req.params.cityId;
                            _context3.next = 3;
                            return _region2.default.find({ city: id }).populate({
                                path: 'city',
                                populate: {
                                    path: 'country',
                                    model: 'country'
                                }
                            });

                        case 3:
                            regions = _context3.sent;
                            return _context3.abrupt("return", res.status(200).json(regions));

                        case 5:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, _this3);
        }))();
    },

    //one region details 
    regionInformaton: function regionInformaton(req, res, next) {
        var _this4 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
            var id, regionInfo;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            id = req.params.regionId;
                            _context4.next = 3;
                            return _region2.default.findById(id).populate({
                                path: 'city',
                                populate: {
                                    path: 'country',
                                    model: 'country'
                                }
                            });

                        case 3:
                            regionInfo = _context4.sent;

                            if (!regionInfo) {
                                _context4.next = 8;
                                break;
                            }

                            return _context4.abrupt("return", res.status(200).json(regionInfo));

                        case 8:
                            return _context4.abrupt("return", res.status(404));

                        case 9:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, _this4);
        }))();
    },

    //validation for updating region
    validateHeader: function validateHeader() {
        var _this5 = this;

        var isUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        return [(0, _check.param)("regionId").exists().withMessage("region Id required").custom(function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(value, _ref4) {
                var req = _ref4.req;
                var regionDetails;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                if (_mongoose2.default.Types.ObjectId.isValid(value)) {
                                    _context5.next = 4;
                                    break;
                                }

                                throw new Error('invalid region Id');

                            case 4:
                                return _context5.abrupt("return", true);

                            case 5:
                                _context5.next = 7;
                                return _region2.default.findById(value);

                            case 7:
                                regionDetails = _context5.sent;

                                if (regionDetails) {
                                    _context5.next = 12;
                                    break;
                                }

                                throw new Error('no region with this id');

                            case 12:
                                return _context5.abrupt("return", true);

                            case 13:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, _this5);
            }));

            return function (_x5, _x6) {
                return _ref3.apply(this, arguments);
            };
        }()), (0, _check.body)("name")
        //check in unquiness of country name
        .custom(function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(value, _ref6) {
                var req = _ref6.req;
                var nameRegion, region;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                nameRegion = { name: value };
                                _context6.next = 3;
                                return _region2.default.findOne(nameRegion).where('city').equals(req.params.cityId);

                            case 3:
                                region = _context6.sent;

                                if (!region) {
                                    _context6.next = 8;
                                    break;
                                }

                                throw new Error('region name already exists');

                            case 8:
                                return _context6.abrupt("return", true);

                            case 9:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, _this5);
            }));

            return function (_x7, _x8) {
                return _ref5.apply(this, arguments);
            };
        }())];
    },


    //update city logic
    updateRegion: function updateRegion(req, res, next) {
        var _this6 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
            var validationErrors, regionId, regionInfo, newRegionInfo;
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            if (!(req.user.type == "ADMIN")) {
                                _context7.next = 22;
                                break;
                            }

                            validationErrors = (0, _check.validationResult)(req).array();

                            if (!(validationErrors.length > 0)) {
                                _context7.next = 4;
                                break;
                            }

                            return _context7.abrupt("return", next(new _ApiError2.default(422, validationErrors)));

                        case 4:
                            _context7.prev = 4;
                            regionId = req.params.regionId;
                            _context7.next = 8;
                            return _region2.default.findById(regionId);

                        case 8:
                            regionInfo = _context7.sent;
                            _context7.next = 11;
                            return _region2.default.update({ _id: regionId }, {
                                $set: {
                                    name: req.body.name || regionInfo.name,
                                    city: req.body.city || regionInfo.city
                                }
                            });

                        case 11:
                            _context7.next = 13;
                            return _region2.default.findById(regionId).populate('city', 'name id');

                        case 13:
                            newRegionInfo = _context7.sent;
                            return _context7.abrupt("return", res.status(200).json({
                                region: newRegionInfo
                            }));

                        case 17:
                            _context7.prev = 17;
                            _context7.t0 = _context7["catch"](4);

                            next(_context7.t0);

                        case 20:
                            _context7.next = 23;
                            break;

                        case 22:
                            return _context7.abrupt("return", next(new _ApiError2.default(403, "must to be Admin user")));

                        case 23:
                        case "end":
                            return _context7.stop();
                    }
                }
            }, _callee7, _this6, [[4, 17]]);
        }))();
    }
};
//# sourceMappingURL=region.controller.js.map