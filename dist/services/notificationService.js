'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sendAnswerNotificToFollowersOfQuestion = exports.sendRealStateChatNotificToOtherOne = undefined;

var sendRealStateChatNotificToOtherOne = exports.sendRealStateChatNotificToOtherOne = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(message, io) {
        var targetUserId, chatNotifi;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        targetUserId = message.issuer.id != message.ads.owner ? message.ads.owner : message.serviceUser;
                        _context.next = 4;
                        return _notification2.default.create({
                            issuer: message.issuer,
                            serviceUser: message.serviceUser,
                            targetUser: targetUserId,
                            subjectOfNotificationTypes: 'user-realEstate-message',
                            subjectOfNotification: message.id,
                            type: 'CHAT'
                        });

                    case 4:
                        chatNotifi = _context.sent;
                        _context.next = 7;
                        return _notification2.default.findById(chatNotifi.id).populate('issuer').populate({
                            path: 'subjectOfNotification',
                            populate: {
                                path: 'ads',
                                model: 'ads-base-model'
                            }
                        });

                    case 7:
                        chatNotifi = _context.sent;

                        console.log(chatNotifi);

                        //in app notification
                        io.of('/notifications').to(targetUserId).emit("newNotification", chatNotifi);

                        //send push notification 
                        (0, _pushNotifications.send)(targetUserId, 'لديك رساله جديده', chatNotifi.subjectOfNotificationTypes, chatNotifi.subjectOfNotification);

                        //  console.log("Chat-ads-Notification-Namespace => ", nsp.name);
                        _context.next = 16;
                        break;

                    case 13:
                        _context.prev = 13;
                        _context.t0 = _context['catch'](0);

                        console.log('ads Chat Notifi Err: ', _context.t0);

                    case 16:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[0, 13]]);
    }));

    return function sendRealStateChatNotificToOtherOne(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();
//send notification to all followers of specific question 


var sendAnswerNotificToFollowersOfQuestion = exports.sendAnswerNotificToFollowersOfQuestion = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(question, io) {
        var followersIds, x, answerNotification, answerNotificationDetails;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.prev = 0;
                        followersIds = question.followersIds;
                        x = 0;

                    case 3:
                        if (!(x < followersIds.length)) {
                            _context2.next = 15;
                            break;
                        }

                        _context2.next = 6;
                        return _notification2.default.create({
                            targetUser: followersIds[x],
                            subjectOfNotificationTypes: "question",
                            subjectOfNotification: question.id,
                            type: 'ANSWER'
                        });

                    case 6:
                        answerNotification = _context2.sent;
                        _context2.next = 9;
                        return _notification2.default.findById(answerNotification.id).populate('targetUser').populate('subjectOfNotification');

                    case 9:
                        answerNotificationDetails = _context2.sent;

                        //in app notification
                        io.of('/notifications').to(followersIds[x]).emit("newNotification", answerNotificationDetails);
                        //send push notification 
                        (0, _pushNotifications.send)(followersIds[x], 'لديك اجابه على سؤال تتابعه ', answerNotificationDetails);

                    case 12:
                        x++;
                        _context2.next = 3;
                        break;

                    case 15:
                        _context2.next = 20;
                        break;

                    case 17:
                        _context2.prev = 17;
                        _context2.t0 = _context2['catch'](0);

                        console.log('ads Chat Notifi Err: ', _context2.t0);

                    case 20:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[0, 17]]);
    }));

    return function sendAnswerNotificToFollowersOfQuestion(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}();

var _notification = require('../models/notification.model');

var _notification2 = _interopRequireDefault(_notification);

var _pushNotifications = require('../services/push-notifications');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
//# sourceMappingURL=notificationService.js.map