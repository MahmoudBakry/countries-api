import express from "express";
import regionController from "../controllers/region.controller";
import passport from "passport";
const requireAuth = passport.authenticate('jwt', { session: false });
const router = express.Router();

router.route('/:countryId/cities/:cityId/regions')
    /**
        * @swagger
        * definitions:
        *   region:
        *     required:
        *     - "name"
        *     - "city"   
        *     properties:
        *       name:
        *         type: string
        *       creationDate:
        *         type: date
        *         readOnly : true  
        *       city: 
        *         type : string
        *         readOnly : true   
        */

    /**
 * @swagger
 * /countries/{countryId}/cities/{cityId}/regions:
 *   post:
 *     tags:
 *       - Region
 *     description: create new region
 *     parameters: 
 *       - name: countryId
 *         descrition : country ID
 *         in : path
 *         required : true
 *       - name: cityId
 *         descrition : city ID
 *         in : path
 *         required : true
 *       - name: name
 *         description: name of city
 *         in: body
 *         required: true            
 *         schema:
 *           $ref: '#/definitions/region'
 *     responses:
 *       201:
 *         description: return created region 
 *       400:
 *         description: You have made an error maybe you didn't provide a required attribute
 *       422: 
 *         description: name of region is duplicated in the  same country or any invalid data
 *       403: 
 *         description: your token is bbelong to normal user not an admin[forrbiden] 
 *       401: 
 *         description: token is required    
*/



    //create new city
    .post(
        requireAuth,
        regionController.validateBody(),
        regionController.createRegion
    )
    //retrive all regions

    /**
    * @swagger
    * /countries/{countryId}/cities/{cityId}/regions:
    *   get:
    *     tags:
    *       - Region
    *     description: retrive all regions
    *     parameters : 
    *       - name : countryId
    *         in : path
    *         required : true
    *       - name : cityId
    *         in : path
    *         required : true       
    *     responses:
    *       200:
    *         description: return all regions 
    *       401: 
    *         description: token is required
    *       204: 
    *         description: no content exist now 
    *   
   */
    .get(regionController.allRegions)


//routes that used regionId 
router.route('/:countryId/cities/:cityId/regions/:regionId')
    //retrive one region 
    .get(regionController.regionInformaton)
    //update one 
    /**
   * @swagger
   * /countries/{countryId}/cities/{cityId}/regions/{regionId}:
   *   put:
   *     tags:
   *       - Region
   *     description: update one region
   *     parameters:
   *       - name : regionId 
   *         in : path
   *         required : true
   *       - name: name
   *         description: name of city
   *         in: body
   *         required: false 
   *       - name: city
   *         description: cityId
   *         in: body
   *         required: false     
   *         schema:
   *           $ref: '#/definitions/region' 
   *     responses:
   *       200:
   *         description: updating proccess done  
   *       403: 
   *         description: your token is bbelong to normal user not an admin[forrbiden] 
   *       401: 
   *         description: token is required
   *       422: 
   *         description: validation error may duplicated region name 
  */
    .put(
        requireAuth,
        regionController.updateRegion)

export default router; 