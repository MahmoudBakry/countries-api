"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _user = require("../models/user.model");

var _user2 = _interopRequireDefault(_user);

var _ApiError = require("../helpers/ApiError");

var _ApiError2 = _interopRequireDefault(_ApiError);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require("../config");

var _config2 = _interopRequireDefault(_config);

var _utils = require("../utils");

var _check = require("express-validator/check");

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _ApiResponse = require("../helpers/ApiResponse");

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

var _lodash = require("lodash");

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var jwtSecret = _config2.default.jwtSecret;

var generateToken = function generateToken(id) {

    return _jsonwebtoken2.default.sign({
        sub: id,
        iss: 'App',
        iat: new Date().getTime()
    }, jwtSecret, { expiresIn: '10000s' });
};

//function check phone regular exression 
//this function support 
// +XX-XXXX-XXXX  
// +XX.XXXX.XXXX  
// +XX XXXX XXXX 
var _checkPhone = function _checkPhone(inputtxt) {
    var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (inputtxt.match(phoneno)) {
        return true;
    } else {
        throw new Error("invalid phone");
    }
};

var validateEmail = function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email)) {
        return true;
    } else {
        throw new Error("invalid email");
    }
};

exports.default = {
    //validation on request parameter during sinup route
    validateBody: function validateBody() {
        var _this = this;

        var isUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        return [(0, _check.body)("email").exists().withMessage("Email is required").isEmail().withMessage("Email is invalid syntax").custom(function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(value, _ref2) {
                var req = _ref2.req;
                var user;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return _user2.default.findOne({ email: value });

                            case 2:
                                user = _context.sent;

                                if (user) {
                                    _context.next = 5;
                                    break;
                                }

                                return _context.abrupt("return", true);

                            case 5:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, _this);
            }));

            return function (_x2, _x3) {
                return _ref.apply(this, arguments);
            };
        }()).withMessage('email exist before'), (0, _check.body)("name").exists().withMessage("name is required"), (0, _check.body)("password").exists().withMessage("password is required"), (0, _check.body)("phone").exists().withMessage("phone is requires").custom(function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(value, _ref4) {
                var req = _ref4.req;
                var user;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return _user2.default.findOne({ phone: value });

                            case 2:
                                user = _context2.sent;

                                if (user) {
                                    _context2.next = 5;
                                    break;
                                }

                                return _context2.abrupt("return", true);

                            case 5:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, _this);
            }));

            return function (_x4, _x5) {
                return _ref3.apply(this, arguments);
            };
        }()).withMessage('phone exist before')];
    },
    signup: function signup(req, res, next) {
        var _this2 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var validationErrors, createdUser, newUser;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            validationErrors = (0, _check.validationResult)(req).array();

                            if (!(validationErrors.length > 0)) {
                                _context3.next = 3;
                                break;
                            }

                            return _context3.abrupt("return", next(new _ApiError2.default(422, validationErrors)));

                        case 3:
                            _context3.prev = 3;

                            if (!req.file) {
                                _context3.next = 8;
                                break;
                            }

                            _context3.next = 7;
                            return (0, _utils.toImgUrl)(req.file);

                        case 7:
                            req.body.img = _context3.sent;

                        case 8:
                            _context3.next = 10;
                            return _user2.default.create(req.body);

                        case 10:
                            createdUser = _context3.sent;
                            _context3.next = 13;
                            return _user2.default.findById(createdUser.id).populate('country');

                        case 13:
                            newUser = _context3.sent;

                            res.status(201).send({ userDetails: newUser, token: generateToken(createdUser.id) });
                            _context3.next = 20;
                            break;

                        case 17:
                            _context3.prev = 17;
                            _context3.t0 = _context3["catch"](3);

                            next(_context3.t0);

                        case 20:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, _this2, [[3, 17]]);
        }))();
    },

    //signin logic function 
    signin: function signin(req, res, next) {
        var _this3 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
            var user, userDetails;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            user = req.user; // Passport

                            _context4.next = 3;
                            return _user2.default.findById(user.id).populate('country notificationPlan userPlan');

                        case 3:
                            userDetails = _context4.sent;

                            res.send({ userDetails: userDetails, token: generateToken(user.id) });

                        case 5:
                        case "end":
                            return _context4.stop();
                    }
                }
            }, _callee4, _this3);
        }))();
    },

    //check email is exist or not 
    checkEmail: function checkEmail(req, res, next) {
        var _this4 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
            var email, user;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            if (req.body.email) {
                                _context5.next = 2;
                                break;
                            }

                            return _context5.abrupt("return", next(new _ApiError2.default(422, 'email is required')));

                        case 2:
                            email = req.body.email;
                            _context5.prev = 3;

                            validateEmail(email);
                            _context5.next = 7;
                            return _user2.default.findOne({ email: email });

                        case 7:
                            user = _context5.sent;

                            if (!user) {
                                _context5.next = 12;
                                break;
                            }

                            return _context5.abrupt("return", res.status(200).json({ unique: false }));

                        case 12:
                            return _context5.abrupt("return", res.status(200).json({ unique: true }));

                        case 13:
                            _context5.next = 18;
                            break;

                        case 15:
                            _context5.prev = 15;
                            _context5.t0 = _context5["catch"](3);

                            next(_context5.t0);

                        case 18:
                        case "end":
                            return _context5.stop();
                    }
                }
            }, _callee5, _this4, [[3, 15]]);
        }))();
    },

    //check if phone is valid or not
    checkPhone: function checkPhone(req, res, next) {
        var _this5 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
            var phone, user;
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            if (req.body.phone) {
                                _context6.next = 2;
                                break;
                            }

                            return _context6.abrupt("return", next(new _ApiError2.default(422, 'phone is required')));

                        case 2:
                            phone = req.body.phone;
                            _context6.prev = 3;

                            _checkPhone(phone);
                            _context6.next = 7;
                            return _user2.default.findOne({ phone: phone });

                        case 7:
                            user = _context6.sent;

                            if (user) {
                                _context6.next = 12;
                                break;
                            }

                            return _context6.abrupt("return", res.status(200).json({ unique: true }));

                        case 12:
                            return _context6.abrupt("return", res.status(200).json({ unique: false }));

                        case 13:
                            _context6.next = 18;
                            break;

                        case 15:
                            _context6.prev = 15;
                            _context6.t0 = _context6["catch"](3);

                            next(_context6.t0);

                        case 18:
                        case "end":
                            return _context6.stop();
                    }
                }
            }, _callee6, _this5, [[3, 15]]);
        }))();
    },


    //validation on request parameter during sinup route
    validateUpdate: function validateUpdate() {
        var _this6 = this;

        var isUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        return [(0, _check.body)("email").isEmail().withMessage("Email is invalid syntax").custom(function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(value, _ref6) {
                var req = _ref6.req;
                var userQuery, user;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                userQuery = { email: value };

                                if (isUpdate && req.user.email === value) userQuery._id = { $ne: req.user._id };

                                _context7.next = 4;
                                return _user2.default.findOne(userQuery);

                            case 4:
                                user = _context7.sent;

                                if (!user) {
                                    _context7.next = 9;
                                    break;
                                }

                                throw new Error('email already exists');

                            case 9:
                                return _context7.abrupt("return", true);

                            case 10:
                            case "end":
                                return _context7.stop();
                        }
                    }
                }, _callee7, _this6);
            }));

            return function (_x7, _x8) {
                return _ref5.apply(this, arguments);
            };
        }()), (0, _check.body)("phone")
        //make custome validation to phone to check on phone[unique, isPhone]
        .custom(function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(value, _ref8) {
                var req = _ref8.req;
                var userPhoneQuery, user;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                //call phone checking pattren function 
                                _checkPhone(value);
                                if (isUpdate && req.user.phone == value) userQuery._id = { $ne: req.user._id };
                                userPhoneQuery = { phone: value };
                                _context8.next = 5;
                                return _user2.default.findOne(userPhoneQuery);

                            case 5:
                                user = _context8.sent;

                                if (!user) {
                                    _context8.next = 10;
                                    break;
                                }

                                throw new Error('phone already exists');

                            case 10:
                                return _context8.abrupt("return", true);

                            case 11:
                            case "end":
                                return _context8.stop();
                        }
                    }
                }, _callee8, _this6);
            }));

            return function (_x9, _x10) {
                return _ref7.apply(this, arguments);
            };
        }())];
    },

    //update profile of user 
    updateProfile: function updateProfile(req, res, next) {
        var _this7 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
            var id, ourUser, newObje, populatedUser;
            return regeneratorRuntime.wrap(function _callee9$(_context9) {
                while (1) {
                    switch (_context9.prev = _context9.next) {
                        case 0:
                            id = req.params.userId;
                            _context9.next = 3;
                            return _user2.default.findById(id);

                        case 3:
                            ourUser = _context9.sent;

                            if (!req.file) {
                                _context9.next = 10;
                                break;
                            }

                            _context9.next = 7;
                            return (0, _utils.toImgUrl)(req.file);

                        case 7:
                            req.body.img = _context9.sent;
                            _context9.next = 11;
                            break;

                        case 10:
                            req.body.img = ourUser.img;

                        case 11:
                            if (req.user.id == ourUser.id) {
                                _context9.next = 13;
                                break;
                            }

                            return _context9.abrupt("return", next(new _ApiError2.default(422, "don't have access to resourse")));

                        case 13:
                            _context9.prev = 13;

                            if (req.body.phone) {
                                _checkPhone(req.body.phone);
                            }

                            if (req.body.email) {
                                validateEmail(req.body.email);
                            }

                            _context9.next = 18;
                            return _user2.default.findByIdAndUpdate(id, req.body, { new: true });

                        case 18:
                            newObje = _context9.sent;
                            _context9.next = 21;
                            return _user2.default.findById(newObje.id).populate('country').populate('userPlan').populate('notificationPlan');

                        case 21:
                            populatedUser = _context9.sent;
                            return _context9.abrupt("return", res.status(200).send(populatedUser));

                        case 25:
                            _context9.prev = 25;
                            _context9.t0 = _context9["catch"](13);

                            next(_context9.t0);

                        case 28:
                        case "end":
                            return _context9.stop();
                    }
                }
            }, _callee9, _this7, [[13, 25]]);
        }))();
    }
};
//# sourceMappingURL=user.controller.js.map