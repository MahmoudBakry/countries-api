'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _notificationHandler = require('./notification-handler');

var _notificationHandler2 = _interopRequireDefault(_notificationHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventHandler = function EventHandler(io) {
    _classCallCheck(this, EventHandler);

    new _notificationHandler2.default(io);
};

exports.default = EventHandler;
//# sourceMappingURL=index.js.map