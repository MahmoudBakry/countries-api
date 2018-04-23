import express from "express";
import CountryController from "../controllers/country.controller";
import countryController from "../controllers/country.controller";
import cityRoute from "./city.route"
import regionRoute from "./region.route";
import passport from "passport";
const requireAuth = passport.authenticate('jwt', { session: false });
const router = express.Router();
router.use(cityRoute);
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


    .post(
    CountryController.validateBody(),
    CountryController.createCountry
    )

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
    .get(countryController.allCountries)
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
    .put(
    requireAuth,
    countryController.validateHeader(),
    countryController.updateCountry
    )
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
    .get(countryController.countryInformaton)
    //delete on country 
    .delete(countryController.deleteCountry)

export default router;