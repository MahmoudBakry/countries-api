import express from "express";
import UserController from "../controllers/user.controller";
import passport from "passport";
import passportService from '../services/passport';
import { multerSaveTo } from "../services/multer";
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignIn = passport.authenticate('local', { session: false });
const router = express.Router();
router.route('/checkemail')
    /**
    * @swagger
    * definitions:
    *   CheckEmail:
    *     required:
    *     - "email"
    *     properties:
    *       email:
    *         type: string
    */
    /**
     * @swagger
     * /checkemail:
     *   put:
     *     tags:
     *       - Validate Data
     *     description: check if email is exist or not
     *     parameters:
     *       - name: email
     *         description: email 
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/CheckEmail'
     *     responses:
     *       200:
     *         description: Returns boolean unique value
     *       422:
     *         description: email is required
    */
    .put(UserController.checkEmail)


router.route('/checkphone')

    /**
    * @swagger
    * definitions:
    *   CheckPhone:
    *     required:
    *     - "phone"
    *     properties:
    *       phone:
    *         type: string
    */

    /**
     * @swagger
     * /checkphone:
     *   put:
     *     tags:
     *       - Validate Data
     *     description: check if phone is exist or not
     *     parameters:
     *       - name: phone
     *         description: phone 
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/CheckPhone'
     *     responses:
     *       200:
     *         description: Returns boolean unique value
     *       422:
     *         description: email is required
    */
    .put(UserController.checkPhone)


/**
* @swagger
* definitions:
*   LoginBody:
*     required:
*     - "email"
*     - "password"
*     properties:
*       email:
*         type: string
*       password:
*         type: string
*/

/**
 * @swagger
 * /signin:
 *   post:
 *     tags:
 *       - Auth
 *     description: Sign in to the api
 *     parameters:
 *       - name: body
 *         description: Credentials
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/LoginBody'
 *     responses:
 *       200:
 *         description: Returns saved user + your token
 *       400:
 *         description: You have made an error maybe you didn't provide a required attribute
*/


router.post("/signin", requireSignIn, UserController.signin);


/**
* @swagger
* definitions:
*   User:
*     required:
*     - "name"
*     - "email"
*     - "password"
*     - "phone"
*     properties:
*       name:
*         type: string
*       email:
*         type: string
*       password:
*         type: string
*       phone:
*         type: string
*       country:
*         type: number
*       img:
*         type: string
*         readOnly: true
*       type : 
*         type : string
*           
*/

/**
 * @swagger
 * /signup:
 *   post:
 *     tags:
 *       - Auth
 *     consumes:
 *       - "multipart/form-data"
 *     description: Sign up to the api
 *     parameters:
 *           - name: "name"
 *             in: "formData"
 *             description: "Name Of User"
 *             required: true
 *             type: "string"
 *           - name: "email"
 *             in: "formData"
 *             description: "email Of User"
 *             required: true
 *             type: "string"
 *           - name: "password"
 *             in: "formData"
 *             description: "password Of User"
 *             required: true
 *             type: "string"
 *           - name: "phone"
 *             in: "formData"
 *             description: "Phone Of User"
 *             required: true
 *             type: "number"
 *           - name: "country"
 *             in: "formData"
 *             description: "Country Of User"
 *             required: true 
 *             type: "string"
 *           - name: "img"
 *             in: "formData"
 *             description: "User Image to upload"
 *             required: false
 *             type: "file"
 *           - name : type 
 *             in : "formData" 
 *             description: type of user ADMIN or NORMAL and normal is default          
 *     responses:
 *       201:
 *         description: Returns saved user + your token
 *       422:
 *         description: You have made an error maybe you didn't provide a required attribute a duplication email or phone  
 */

router.route('/signup')
    .post(
        multerSaveTo('users').single('img'),
        UserController.validateBody(),
        UserController.signup
    )
export default router;
