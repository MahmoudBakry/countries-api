import Country from "../models/country.model";
import City from "../models/city.model";
import ApiError from "../helpers/ApiError";
import { body, param, validationResult } from 'express-validator/check';
import mongoose, { Schema } from "mongoose";
import { toImgUrl } from '../utils';
export default {
    validateBody(isUpdate = false) {
        return [
            body("name").exists().withMessage("name is required")
                //check in unquiness of country name
                .custom(async (value, { req }) => {
                    let nameCity = { name: value };
                    if (isUpdate && req.user.name === value)
                        userQuery._id = { $ne: req.user._id };

                    let city = await City.findOne(nameCity).
                        where('country').equals(req.params.countryId)
                    if (city)
                        throw new Error('city name already exists');
                    else
                        return true;
                })
        ];
    },
    //creatre new city logic
    async createCity(req, res, next) {
        if (req.user.type == "ADMIN") {
            const validationErrors = validationResult(req).array();
            if (validationErrors.length > 0)
                return next(new ApiError(422, validationErrors));
            try {
                if (req.file) {
                    req.body.img = await toImgUrl(req.file);
                }
                let newCity = {
                    name: req.body.name,
                    country: req.params.countryId,
                    img: req.body.img
                }
                let createdCity = await City.create(newCity);
                let response = await City.findById(createdCity.id).populate('country')
                return res.status(201).json(response)
            } catch (err) {
                next(err)
            }
        }
        return next(new ApiError(403, "must to be Admin user"));

    },
    //all cities logic 
    async allCities(req, res, next) {
        if (!req.params.countryId) {
            next(new ApiError(422, "missed country id"))
        }
        const countryId = req.params.countryId
        let country = await Country.findById(countryId)
        if (!country)
            return res.status(404);

        let cities = await City.find({ country: req.params.countryId }).populate('country')
        return res.status(200).json(cities)
    },
    //one city details 
    async cityInformaton(req, res, next) {
        const id = req.params.cityId;

        let cityInfo = await City.findById(id).populate('country', 'name id')
        if (cityInfo)
            return res.status(200).json({ city: cityInfo })
        else
            return res.status(404).end();
    },
    //validation for updating city
    validateHeader(isUpdate = true) {
        return [
            param("cityId").exists().withMessage("city Id required")
                .custom(async (value, { req }) => {
                    let cityDetails = await City.findById(value);
                    if (!cityDetails) {
                        throw new Error('no country with this id');
                    } else { return true }
                }),
            body("name")
                //check in unquiness of country name
                .custom(async (value, { req }) => {
                    let nameCity = { name: value };
                    let city = await City.findOne(nameCity)
                        .where('country').equals(req.params.countryId)

                    console.log(city);
                    if (city) {
                        throw new Error('city name already exists');
                    } else
                        return true;
                })
        ]
    },
    //update city logic
    async updateCity(req, res, next) {
        if (req.user.type == "ADMIN") {
            const validationErrors = validationResult(req).array();
            if (validationErrors.length > 0)
                return next(new ApiError(422, validationErrors));
            try {
                if (req.file) {
                    req.body.img = await toImgUrl(req.file);
                }
                let cityId = req.params.cityId;
                let cityInfo = await City.findById(cityId);
                //updating countryInfo
                await City.update({ _id: cityId }, {
                    $set: {
                        name: req.body.name || cityInfo.name,
                        country: req.body.country || cityInfo.country,
                        img: req.body.img || cityInfo.img
                    }
                })
                //return country after updating
                let newCityInfo = await City.findById(cityId);
                return res.status(200).json(newCityInfo)
            } catch (err) {
                next(err)
            }
        } else
            return next(new ApiError(403, "must to be Admin user"));
    },
    //delete on country
    async deleteCity(req, res, next) {
        return res.status(200).json({ "msg": "it works later" });
    },


}