"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _country = require("../controllers/country.controller");

var _country2 = _interopRequireDefault(_country);

var _city = require("./city.route");

var _city2 = _interopRequireDefault(_city);

var _region = require("./region.route");

var _region2 = _interopRequireDefault(_region);

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requireAuth = _passport2.default.authenticate('jwt', { session: false });
var router = _express2.default.Router();
router.use(_city2.default);
//router.use(regionRoute);


router.route('/')
/**
* @swagger
* definitions:
*   country:
*     required:
*     - "name"
*     properties:
*       name:
*         type: string
*       creationDate:
*         type: date
*         readOnly: true  
*/

/**
 * @swagger
 * /countries:
 *   post:
 *     tags:
 *       - Country
 *     description: create new countrey
 *     parameters:
 *       - name: name
 *         description: name of country
 *         in: body
 *         required: true 
 *         schema:
 *           $ref: '#/definitions/country'
 *     responses:
 *       201:
 *         description: return created country 
 *       400:
 *         description: You have made an error maybe you didn't provide a required attribute
 *       422: 
 *         description: name of country is duplicated 
 *       401: 
 *         description: token is required
 *       403: 
 *         description: your token is bbelong to normal user not an admin[forrbiden] 
 *     
*/

.post(_country2.default.validateBody(), _country2.default.createCountry)

/**
 * @swagger
 * /countries:
 *   get:
 *     tags:
 *       - Country
 *     description: retrive all countries
 *     responses:
 *       200:
 *         description: return all countries 
 *       401: 
 *         description: token is required
 *       204: 
 *         description: no content exist now 
 *   
*/
.get(_country2.default.allCountries);
//routes for update, retrive one countrey, delete country 
router.route('/:id')
/**
  * @swagger
  * /countries/{id}:
  *   put:
  *     tags:
  *       - Country
  *     description: update one countries
  *     parameters:
  *       - name : id 
  *         in : path
  *         require : true
  *       - name: name
  *         description: name of country
  *         in: body
  *         required: flase      
  *         schema:
  *           $ref: '#/definitions/country' 
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
.put(requireAuth, _country2.default.validateHeader(), _country2.default.updateCountry)
//get one country details 

/**
 * @swagger
 * /countries/{id}:
 *   get:
 *     tags:
 *       - Country
 *     description: retrive one country details
 *     parameters: 
 *       - name : id
 *         in : path
 *         require : true 
 *     responses:
 *       200:
 *         description: return one countries 
 *       401: 
 *         description: token is required
 *       204: 
 *         description: no content exist now 
 *       422: 
 *         description : validation error in countryId may be invalid or missed    
*/
.get(_country2.default.countryInformaton)
//delete on country 
.delete(_country2.default.deleteCountry);

exports.default = router;
//# sourceMappingURL=country.route.js.map