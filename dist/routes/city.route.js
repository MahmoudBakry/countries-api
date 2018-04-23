"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _city = require("../controllers/city.controller");

var _city2 = _interopRequireDefault(_city);

var _region = require("./region.route");

var _region2 = _interopRequireDefault(_region);

var _multer = require("../services/multer");

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var requireAuth = _passport2.default.authenticate('jwt', { session: false });
router.use(_region2.default);

router.route('/:countryId/cities')
//create new city
/**
    * @swagger
    * definitions:
    *   city:
    *     required:
    *     - "name"
    *     - "country"   
    *     properties:
    *       name:
    *         type: string
    *       creationDate:
    *         type: date
    *         readOnly : true  
    *       country: 
    *         type : number
    *         readOnly : true    
    */

/**
* @swagger
* /countries/{countryId}/cities:
*   post:
*     consumes:
*         - multipart/form-data
*     tags:
*       - City
*     description: create new city
*     parameters: 
*       - name: countryId
*         descrition : country ID
*         in : path
*         required : true
*       - name: "name"
*         in: formData
*         description: "Name Of city"
*         required: true
*         type: string   
*       - name: "img"
*         in: formData
*         description: city Image to upload
*         required: false
*         type: "file"  
*         schema:
*           $ref: '#/definitions/city'
*     responses:
*       201:
*         description: return created city 
*       400:
*         description: You have made an error maybe you didn't provide a required attribute
*       422: 
*         description: name of city is duplicated in the  same country or any invalid data
*       403: 
*         description: your token is bbelong to normal user not an admin[forrbiden] 
*       401: 
*         description: token is required    
*/
.post((0, _multer.multerSaveTo)('city').single('img'), requireAuth, _city2.default.validateBody(), _city2.default.createCity)
//retrive all cities
/**
* @swagger
* /countries/{countryId}/cities:
*   get:
*     tags:
*       - City
*     description: retrive all cities
*     parameters : 
*       - name : countryId
*         in : path
*         required : true       
*     responses:
*       200:
*         description: return all cities 
*       401: 
*         description: token is required
*       204: 
*         description: no content exist now 
*   
*/
.get(_city2.default.allCities);
//routes using cityId 
router.route('/:countryId/cities/:cityId')

//retrive one city details
//retrive one city
/**
* @swagger
* /countries/{countryId}/cities/{cityId}:
*   get:
*     tags:
*       - City
*     description: retrive one city
*     parameters : 
*       - name : cityId
*         in : path
*         required : true   
*     responses:
*       200:
*         description: return city information 
*       401: 
*         description: token is required
*       204: 
*         description: no content exist now 
*       422: 
*         description : validation error in cityId may be invalid or missed
*   
*/
.get(_city2.default.cityInformaton)
//udpate one city
/**
 * @swagger
 * /countries/{countryId}/cities/{cityId}:
 *   put:
 *     consumes:
 *         - multipart/form-data
 *     tags:
 *       - City
 *     description: update one city
 *     parameters:
 *       - name : cityId 
 *         in : path
 *         required : true
 *       - name: countryId
 *         descrition : country ID
 *         in : path
 *         required : true
 *       - name: "name"
 *         in: formData
 *         description: "Name Of city"
 *         required: true
 *         type: string   
 *       - name: "img"
 *         in: formData
 *         description: city Image to upload
 *         required: false
 *         type: "file"  
 *         schema:
 *           $ref: '#/definitions/city' 
 *     responses:
 *       200:
 *         description: updating proccess done  
 *       403: 
 *         description: your token is bbelong to normal user not an admin[forrbiden] 
 *       401: 
 *         description: token is required
 *       422: 
 *         description: validation error may duplicated country name 
*/
.put((0, _multer.multerSaveTo)('city').single('img'), requireAuth, _city2.default.updateCity);
exports.default = router;
//# sourceMappingURL=city.route.js.map