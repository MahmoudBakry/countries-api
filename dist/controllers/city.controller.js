"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _country = require("../models/country.model");

var _country2 = _interopRequireDefault(_country);

var _city = require("../models/city.model");

var _city2 = _interopRequireDefault(_city);

var _ApiError = require("../helpers/ApiError");

var _ApiError2 = _interopRequireDefault(_ApiError);

var _check = require("express-validator/check");

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _utils = require("../utils");

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
                var nameCity, city;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                nameCity = { name: value };

                                if (isUpdate && req.user.name === value) userQuery._id = { $ne: req.user._id };

                                _context.next = 4;
                                return _city2.default.findOne(nameCity).where('country').equals(req.params.countryId);

                            case 4:
                                city = _context.sent;

                                if (!city) {
                                    _context.next = 9;
                                    break;
                                }

                                throw new Error('city name already exists');

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

    //creatre new city logic
    createCity: function createCity(req, res, next) {
        var _this2 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var validationErrors, newCity, createdCity, response;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            if (!(req.user.type == "ADMIN")) {
                                _context2.next = 22;
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

                            if (!req.file) {
                                _context2.next = 9;
                                break;
                            }

                            _context2.next = 8;
                            return (0, _utils.toImgUrl)(req.file);

                        case 8:
                            req.body.img = _context2.sent;

                        case 9:
                            newCity = {
                                name: req.body.name,
                                country: req.params.countryId,
                                img: req.body.img
                            };
                            _context2.next = 12;
                            return _city2.default.create(newCity);

                        case 12:
                            createdCity = _context2.sent;
                            _context2.next = 15;
                            return _city2.default.findById(createdCity.id).populate('country');

                        case 15:
                            response = _context2.sent;
                            return _context2.abrupt("return", res.status(201).json(response));

                        case 19:
                            _context2.prev = 19;
                            _context2.t0 = _context2["catch"](4);

                            next(_context2.t0);

                        case 22:
                            return _context2.abrupt("return", next(new _ApiError2.default(403, "must to be Admin user")));

                        case 23:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2, [[4, 19]]);
        }))();
    },

    //all cities logic 
    allCities: function allCities(req, res, next) {
        var _this3 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var countryId, country, cities;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            if (!req.params.countryId) {
                                next(new _ApiError2.default(422, "missed country id"));
                            }
                            countryId = req.params.countryId;
                            _context3.next = 4;
                            return _country2.default.findById(countryId);

                        case 4:
                            country = _context3.sent;

                            if (country) {
                                _context3.next = 7;
                                break;
                            }

                            return _context3.abrupt("return", res.status(404));

                        case 7:
                            _context3.next = 9;
                            return _city2.default.find({ country: req.params.countryId }).populate('country');

                        case 9:
                            cities = _context3.sent;
                            return _context3.abrupt("return", res.status(200).json(cities));

                        case 11:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, _this3);
        }))();
    },

    //one city details 
    cityInformaton: function cityInformaton(req, res, next) {
        var _this4 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
            var id, cityInfo;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            id = req.params.cityId;
                            _context4.next = 3;
                            return _city2.default.findById(id).populate('country', 'name id');

                        case 3:
                            cityInfo = _context4.sent;

                            if (!cityInfo) {
                                _context4.next = 8;
                                break;
                            }

                            return _context4.abrupt("return", res.status(200).json({ city: cityInfo }));

                        case 8:
                            return _context4.abrupt("return", res.status(404).end());

                        case 9:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, _this4);
        }))();
    },

    //validation for updating city
    validateHeader: function validateHeader() {
        var _this5 = this;

        var isUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        return [(0, _check.param)("cityId").exists().withMessage("city Id required").custom(function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(value, _ref4) {
                var req = _ref4.req;
                var cityDetails;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return _city2.default.findById(value);

                            case 2:
                                cityDetails = _context5.sent;

                                if (cityDetails) {
                                    _context5.next = 7;
                                    break;
                                }

                                throw new Error('no country with this id');

                            case 7:
                                return _context5.abrupt("return", true);

                            case 8:
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
                var nameCity, city;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                nameCity = { name: value };
                                _context6.next = 3;
                                return _city2.default.findOne(nameCity).where('country').equals(req.params.countryId);

                            case 3:
                                city = _context6.sent;


                                console.log(city);

                                if (!city) {
                                    _context6.next = 9;
                                    break;
                                }

                                throw new Error('city name already exists');

                            case 9:
                                return _context6.abrupt("return", true);

                            case 10:
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
    updateCity: function updateCity(req, res, next) {
        var _this6 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
            var validationErrors, cityId, cityInfo, newCityInfo;
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            if (!(req.user.type == "ADMIN")) {
                                _context7.next = 26;
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

                            if (!req.file) {
                                _context7.next = 9;
                                break;
                            }

                            _context7.next = 8;
                            return (0, _utils.toImgUrl)(req.file);

                        case 8:
                            req.body.img = _context7.sent;

                        case 9:
                            cityId = req.params.cityId;
                            _context7.next = 12;
                            return _city2.default.findById(cityId);

                        case 12:
                            cityInfo = _context7.sent;
                            _context7.next = 15;
                            return _city2.default.update({ _id: cityId }, {
                                $set: {
                                    name: req.body.name || cityInfo.name,
                                    country: req.body.country || cityInfo.country,
                                    img: req.body.img || cityInfo.img
                                }
                            });

                        case 15:
                            _context7.next = 17;
                            return _city2.default.findById(cityId);

                        case 17:
                            newCityInfo = _context7.sent;
                            return _context7.abrupt("return", res.status(200).json(newCityInfo));

                        case 21:
                            _context7.prev = 21;
                            _context7.t0 = _context7["catch"](4);

                            next(_context7.t0);

                        case 24:
                            _context7.next = 27;
                            break;

                        case 26:
                            return _context7.abrupt("return", next(new _ApiError2.default(403, "must to be Admin user")));

                        case 27:
                        case "end":
                            return _context7.stop();
                    }
                }
            }, _callee7, _this6, [[4, 21]]);
        }))();
    },

    //delete on country
    deleteCity: function deleteCity(req, res, next) {
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
//# sourceMappingURL=city.controller.js.map