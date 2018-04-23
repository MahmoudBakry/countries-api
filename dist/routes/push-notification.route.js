"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requireAuth = _passport2.default.authenticate('jwt', { session: false });

var router = _express2.default.Router();

/**
 * @swagger
 * /push-subscribe:
 *   post:
 *     tags:
 *       - Push Notifications
 *     description: Add a new token for first time
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           required:
 *           - "token"
 *           properties:
 *            token:
 *             type: string
 *     responses:
 *       204:
 *         description: No Content
 *       422:
 *         description: token is required
 *       401:
 *         description: UnAuthorized
*/

/**
 * @swagger
 * /push-unsubscribe:
 *   post:
 *     tags:
 *       - Push Notifications
 *     description: Remove this token from subscribtions
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           required:
 *           - "token"
 *           properties:
 *            token:
 *             type: string
 *     responses:
 *       204:
 *         description: No Content
 *       422:
 *         description: token is required
 *       401:
 *         description: UnAuthorized
*/

/**
 * @swagger
 * /push-update:
 *   post:
 *     tags:
 *       - Push Notifications
 *     description: Update subscription of specific token (onTokenRefresh firebase specific )
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           required:
 *           - "oldToken"
 *           - "newToken"
 *           properties:
 *            oldToken:
 *             type: string
 *            newToken:
 *             type: string
 *     responses:
 *       204:
 *         description: No Content
 *       422:
 *         description: oldToken or newToken are required
 *       401:
 *         description: UnAuthorized
*/

router.post("/push-subscribe", requireAuth, PushController.subscribe);
router.post("/push-unsubscribe", requireAuth, PushController.unsubscribe);
router.post("/push-update", requireAuth, PushController.update);

exports.default = router;
//# sourceMappingURL=push-notification.route.js.map