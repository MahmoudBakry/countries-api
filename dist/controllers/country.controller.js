"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _country = require("../models/country.model");

var _country2 = _interopRequireDefault(_country);

var _ApiError = require("../helpers/ApiError");

var _ApiError2 = _interopRequireDefault(_ApiError);

var _config = require("../config");

var _config2 = _interopRequireDefault(_config);

var _check = require("express-validator/check");

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
    //validation to country model 
    validateBody: function validateBody() {
        var _this = this;

        var isUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        return [(0, _check.body)("name").exists().withMessage("name is required")
        //check in unquiness of country name
        .custom(function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(value, _ref2) {
                var req = _ref2.req;
                var nameCountry, country;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                nameCountry = { name: value };

                                if (isUpdate && req.user.name === value) userQuery._id = { $ne: req.user._id };

                                _context.next = 4;
                                return _country2.default.findOne(nameCountry);

                            case 4:
                                country = _context.sent;

                                if (!country) {
                                    _context.next = 9;
                                    break;
                                }

                                throw new Error('country name already exists');

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

    //create new country logic 
    createCountry: function createCountry(req, res, next) {
        var _this2 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var validationErrors, newCountry;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            validationErrors = (0, _check.validationResult)(req).array();

                            if (!(validationErrors.length > 0)) {
                                _context2.next = 3;
                                break;
                            }

                            return _context2.abrupt("return", next(new _ApiError2.default(422, validationErrors)));

                        case 3:
                            _context2.prev = 3;
                            _context2.next = 6;
                            return _country2.default.create(req.body);

                        case 6:
                            newCountry = _context2.sent;
                            return _context2.abrupt("return", res.status(201).json(newCountry));

                        case 10:
                            _context2.prev = 10;
                            _context2.t0 = _context2["catch"](3);

                            next(_context2.t0);

                        case 13:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2, [[3, 10]]);
        }))();
    },

    //retirive all countries logic 
    allCountries: function allCountries(req, res, next) {
        var _this3 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var countries;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.next = 2;
                            return _country2.default.find().select('id name creationDate');

                        case 2:
                            countries = _context3.sent;

                            if (!(countries.length > 0)) {
                                _context3.next = 5;
                                break;
                            }

                            return _context3.abrupt("return", res.status(200).json(countries));

                        case 5:
                            return _context3.abrupt("return", res.status(204));

                        case 6:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, _this3);
        }))();
    },

    //validation for updating country
    validateHeader: function validateHeader() {
        var _this4 = this;

        var isUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        return [(0, _check.param)("id").exists().withMessage("counrey Id required").custom(function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(value, _ref4) {
                var req = _ref4.req;
                var countryDetails;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                if (_mongoose2.default.Types.ObjectId.isValid(value)) {
                                    _context4.next = 4;
                                    break;
                                }

                                throw new Error('invalid country Id');

                            case 4:
                                return _context4.abrupt("return", true);

                            case 5:
                                _context4.next = 7;
                                return _country2.default.findById(value);

                            case 7:
                                countryDetails = _context4.sent;

                                if (countryDetails) {
                                    _context4.next = 12;
                                    break;
                                }

                                throw new Error('no country with this id');

                            case 12:
                                return _context4.abrupt("return", true);

                            case 13:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, _this4);
            }));

            return function (_x5, _x6) {
                return _ref3.apply(this, arguments);
            };
        }()), (0, _check.body)("name")
        //check in unquiness of country name
        .custom(function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(value, _ref6) {
                var req = _ref6.req;
                var nameCountry, country;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                nameCountry = { name: value };
                                _context5.next = 3;
                                return _country2.default.findOne(nameCountry);

                            case 3:
                                country = _context5.sent;

                                if (!country) {
                                    _context5.next = 8;
                                    break;
                                }

                                throw new Error('country name already exists');

                            case 8:
                                return _context5.abrupt("return", true);

                            case 9:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, _this4);
            }));

            return function (_x7, _x8) {
                return _ref5.apply(this, arguments);
            };
        }())];
    },

    //update country logic
    updateCountry: function updateCountry(req, res, next) {
        var _this5 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
            var validationErrors, countryId, countryInfo, newCountryInfo;
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            if (!(req.user.type == "ADMIN")) {
                                _context6.next = 22;
                                break;
                            }

                            validationErrors = (0, _check.validationResult)(req).array();

                            if (!(validationErrors.length > 0)) {
                                _context6.next = 4;
                                break;
                            }

                            return _context6.abrupt("return", next(new _ApiError2.default(422, validationErrors)));

                        case 4:
                            _context6.prev = 4;
                            countryId = req.params.id;
                            _context6.next = 8;
                            return _country2.default.findById(countryId);

                        case 8:
                            countryInfo = _context6.sent;
                            _context6.next = 11;
                            return _country2.default.update({ _id: countryId }, {
                                $set: {
                                    name: req.body.name || countryInfo.name
                                }
                            });

                        case 11:
                            _context6.next = 13;
                            return _country2.default.findById(countryId);

                        case 13:
                            newCountryInfo = _context6.sent;
                            return _context6.abrupt("return", res.status(200).json({
                                newCountry: newCountryInfo
                            }));

                        case 17:
                            _context6.prev = 17;
                            _context6.t0 = _context6["catch"](4);

                            next(_context6.t0);

                        case 20:
                            _context6.next = 23;
                            break;

                        case 22:
                            return _context6.abrupt("return", next(new _ApiError2.default(403, "must to be Admin user")));

                        case 23:
                        case "end":
                            return _context6.stop();
                    }
                }
            }, _callee6, _this5, [[4, 17]]);
        }))();
    },


    //retrive one country 
    countryInformaton: function countryInformaton(req, res, next) {
        var _this6 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
            var id, countryInfo;
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            id = req.params.id;

                            if (_mongoose2.default.Types.ObjectId.isValid(id)) {
                                _context7.next = 3;
                                break;
                            }

                            return _context7.abrupt("return", next(new _ApiError2.default(422, "invlaid country id")));

                        case 3:
                            _context7.next = 5;
                            return _country2.default.findById(id);

                        case 5:
                            countryInfo = _context7.sent;

                            if (!countryInfo) {
                                _context7.next = 10;
                                break;
                            }

                            return _context7.abrupt("return", res.status(200).json({ country: countryInfo }));

                        case 10:
                            return _context7.abrupt("return", res.status(204));

                        case 11:
                        case "end":
                            return _context7.stop();
                    }
                }
            }, _callee7, _this6);
        }))();
    },

    //delete on country
    deleteCountry: function deleteCountry(req, res, next) {
        var _this7 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            return _context8.abrupt("return", res.status(200).json({ "msg": "it works later" }));

                        case 1:
                        case "end":
                            return _context8.stop();
                    }
                }
            }, _callee8, _this7);
        }))();
    }
};
//# sourceMappingURL=country.controller.js.map