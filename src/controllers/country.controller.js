import Country from "../models/country.model";
import ApiError from "../helpers/ApiError";
import config from "../config";
import { body, param, validationResult } from 'express-validator/check';
import countryModel from "../models/country.model";
import mongoose, { Schema } from "mongoose";

export default {
    //validation to country model 
    validateBody(isUpdate = false) {
        return [
            body("name").exists().withMessage("name is required")
                //check in unquiness of country name
                .custom(async (value, { req }) => {
                    let nameCountry = { name: value };
                    if (isUpdate && req.user.name === value)
                        userQuery._id = { $ne: req.user._id };

                    let country = await Country.findOne(nameCountry);
                    if (country)
                        throw new Error('country name already exists');
                    else
                        return true;
                })
        ];
    },
    //create new country logic 
    async createCountry(req, res, next) {
        const validationErrors = validationResult(req).array();
        if (validationErrors.length > 0)
            return next(new ApiError(422, validationErrors));
        try {
            let newCountry = await countryModel.create(req.body);
            return res.status(201).json(newCountry)
        } catch (err) {
            next(err)
        }
    },
    //retirive all countries logic 
    async allCountries(req, res, next) {
        let countries = await Country.find().select('id name creationDate');
        if (countries.length > 0) {
            return res.status(200).json(countries)
        }

        return res.status(204)
    },
    //validation for updating country
    validateHeader(isUpdate = true) {
        return [
            param("id").exists().withMessage("counrey Id required")
                .custom(async (value, { req }) => {
                    if (!mongoose.Types.ObjectId.isValid(value)) {
                        throw new Error('invalid country Id');
                    } else { return true }
                    let countryDetails = await Country.findById(value);
                    if (!countryDetails) {
                        throw new Error('no country with this id');
                    } else { return true }
                }),
            body("name")
                //check in unquiness of country name
                .custom(async (value, { req }) => {
                    let nameCountry = { name: value };
                    let country = await Country.findOne(nameCountry)
                    //console.log(country.length);
                    if (country) {
                        throw new Error('country name already exists');
                    } else
                        return true;
                })
        ]
    },
    //update country logic
    async updateCountry(req, res, next) {
        if (req.user.type == "ADMIN") {
            const validationErrors = validationResult(req).array();
            if (validationErrors.length > 0)
                return next(new ApiError(422, validationErrors));

            try {
                let countryId = req.params.id;
                let countryInfo = await Country.findById(countryId);

                //updating countryInfo
                await Country.update({ _id: countryId }, {
                    $set: {
                        name: req.body.name || countryInfo.name,
                    }
                })
                //return country after updating
                let newCountryInfo = await Country.findById(countryId);
                return res.status(200).json({
                    newCountry: newCountryInfo
                })
            } catch (err) {
                next(err)
            }
        } else
            return next(new ApiError(403, "must to be Admin user"));

    },

    //retrive one country 
    async countryInformaton(req, res, next) {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ApiError(422, "invlaid country id"));
        }
        let countryInfo = await Country.findById(id);
        if (countryInfo)
            return res.status(200).json({ country: countryInfo })
        else
            return res.status(204)
    },
    //delete on country
    async deleteCountry(req, res, next) {
        return res.status(200).json({ "msg": "it works later" });
    },


}