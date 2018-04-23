import City from "../models/city.model";
import Region from "../models/region.model";
import ApiError from "../helpers/ApiError";
import { body, param, validationResult } from 'express-validator/check';
import mongoose, { Schema } from "mongoose";


export default {

    validateBody(isUpdate = false) {
        return [
            body("name").exists().withMessage("name is required")
                //check in unquiness of country name
                .custom(async (value, { req }) => {
                    let nameRegion = { name: value };
                    if (isUpdate && req.user.name === value)
                        userQuery._id = { $ne: req.user._id };

                    let region = await Region.findOne(nameRegion).
                        where('city').equals(req.params.cityId)
                    if (region)
                        throw new Error('region name already exists');
                    else
                        return true;
                })
        ];
    },
    //creatre new region logic
    async createRegion(req, res, next) {
        if (req.user.type == "ADMIN") {
            const validationErrors = validationResult(req).array();
            if (validationErrors.length > 0)
                return next(new ApiError(422, validationErrors));
            try {
                let newRegion = {
                    name: req.body.name,
                    city: req.params.cityId
                }
                let createdRegion = await Region.create(newRegion);
                let response = await Region.findById(createdRegion)
                    .populate({
                        path: 'city',
                        populate: {
                            path: 'country',
                            model: 'country'
                        }
                    })
                return res.status(201).json(response)
            } catch (err) {
                next(err)
            }
        }

    },

    //all cities logic 
    async allRegions(req, res, next) {
        let id = req.params.cityId
        let regions = await Region.find({ city: id }).populate({
            path: 'city',
            populate: {
                path: 'country',
                model: 'country'
            }
        })
        return res.status(200).json(regions)
    },
    //one region details 
    async regionInformaton(req, res, next) {
        const id = req.params.regionId;
        let regionInfo = await Region.findById(id).populate({
            path: 'city',
            populate: {
                path: 'country',
                model: 'country'
            }
        })
        if (regionInfo)
            return res.status(200).json(regionInfo)
        else
            return res.status(404)
    },
    //validation for updating region
    validateHeader(isUpdate = true) {
        return [
            param("regionId").exists().withMessage("region Id required")
                .custom(async (value, { req }) => {
                    if (!mongoose.Types.ObjectId.isValid(value)) {
                        throw new Error('invalid region Id');
                    } else { return true }
                    let regionDetails = await Region.findById(value);
                    if (!regionDetails) {
                        throw new Error('no region with this id');
                    } else { return true }
                }),
            body("name")
                //check in unquiness of country name
                .custom(async (value, { req }) => {
                    let nameRegion = { name: value };
                    let region = await Region.findOne(nameRegion)
                        .where('city').equals(req.params.cityId)
                    if (region) {
                        throw new Error('region name already exists');
                    } else
                        return true;
                })
        ]
    },

    //update city logic
    async updateRegion(req, res, next) {
        if (req.user.type == "ADMIN") {
            const validationErrors = validationResult(req).array();
            if (validationErrors.length > 0)
                return next(new ApiError(422, validationErrors));

            try {
                let regionId = req.params.regionId;
                let regionInfo = await Region.findById(regionId);

                //updating countryInfo
                await Region.update({ _id: regionId }, {
                    $set: {
                        name: req.body.name || regionInfo.name,
                        city: req.body.city || regionInfo.city
                    }
                })
                //return country after updating
                let newRegionInfo = await Region.findById(regionId)
                    .populate('city', 'name id');
                return res.status(200).json({
                    region: newRegionInfo
                })
            } catch (err) {
                next(err)
            }
        } else
            return next(new ApiError(403, "must to be Admin user"));

    },



}
