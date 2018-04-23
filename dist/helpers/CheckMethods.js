'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isInternationNo = exports.isYear = exports.isLng = exports.isLat = exports.isImgUrl = exports.isArray = exports.isNumeric = exports.validIds = exports.validId = exports.checkExistThenGet = exports.checkExist = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _ApiError = require('./ApiError');

var _ApiError2 = _interopRequireDefault(_ApiError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// const CapitalizeFirstChar = (name) => name.charAt(0).toUpperCase() + name.slice(1);

var checkExist = exports.checkExist = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(id, Model) {
        var extraQuery = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var errorMessage = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
        var model;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        // to be optimized
                        if ((typeof extraQuery === 'undefined' ? 'undefined' : _typeof(extraQuery)) != 'object') {
                            errorMessage = extraQuery;
                            extraQuery = {};
                        }

                        if (!validId(id)) {
                            _context.next = 7;
                            break;
                        }

                        _context.next = 4;
                        return Model.findOne(_extends({ _id: id }, extraQuery)).lean();

                    case 4:
                        model = _context.sent;

                        if (!model) {
                            _context.next = 7;
                            break;
                        }

                        return _context.abrupt('return');

                    case 7:
                        throw new _ApiError2.default(404, errorMessage ? errorMessage : Model.modelName + ' Not Found');

                    case 8:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function checkExist(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var checkExistThenGet = exports.checkExistThenGet = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(id, Model) {
        var extraQuery = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { populate: '' };
        var errorMessage = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
        var populateQuery, model;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        populateQuery = extraQuery.populate || '';

                        // to be optimized

                        if ((typeof extraQuery === 'undefined' ? 'undefined' : _typeof(extraQuery)) != 'object') {
                            errorMessage = extraQuery;
                            extraQuery = {};
                        } else {
                            delete extraQuery.populate;
                        }

                        if (!validId(id)) {
                            _context2.next = 8;
                            break;
                        }

                        _context2.next = 5;
                        return Model.findOne(_extends({ _id: id }, extraQuery)).populate(populateQuery);

                    case 5:
                        model = _context2.sent;

                        if (!model) {
                            _context2.next = 8;
                            break;
                        }

                        return _context2.abrupt('return', model);

                    case 8:
                        throw new _ApiError2.default(404, errorMessage ? errorMessage : Model.modelName + ' Not Found');

                    case 9:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function checkExistThenGet(_x5, _x6) {
        return _ref2.apply(this, arguments);
    };
}();

var validId = exports.validId = function validId(id) {
    return isNumeric(id);
};
var validIds = exports.validIds = function validIds(ids) {
    return isArray(ids) && ids.every(function (id) {
        return validId(id);
    });
};
var isNumeric = exports.isNumeric = function isNumeric(value) {
    return Number.isInteger(parseInt(value));
};
var isArray = exports.isArray = function isArray(values) {
    return Array.isArray(values);
};
var isImgUrl = exports.isImgUrl = function isImgUrl(value) {
    return (/\.(jpeg|jpg|png)$/.test(value)
    );
};
var isLat = exports.isLat = function isLat(value) {
    return (/^\(?[+-]?(90(\.0+)?|[1-8]?\d(\.\d+)?)$/.test(value)
    );
};
var isLng = exports.isLng = function isLng(value) {
    return (/^\s?[+-]?(180(\.0+)?|1[0-7]\d(\.\d+)?|\d{1,2}(\.\d+)?)\)?$/.test(value)
    );
};
var isYear = exports.isYear = function isYear(value) {
    return (/^\d{4}$/.test(value)
    );
};
var isInternationNo = exports.isInternationNo = function isInternationNo(value) {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(value)
    );
};
//# sourceMappingURL=CheckMethods.js.map