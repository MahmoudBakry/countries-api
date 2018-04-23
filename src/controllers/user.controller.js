import User from "../models/user.model";
import ApiError from "../helpers/ApiError";
import jwt from "jsonwebtoken";
import config from "../config";
import { toImgUrl } from '../utils';
import { body, validationResult } from 'express-validator/check';
import mongoose, { Schema } from "mongoose";
import ApiResponse from '../helpers/ApiResponse';
import { escapeRegExp } from 'lodash';
import moment from 'moment'



const { jwtSecret } = config;
const generateToken = id => {

    return jwt.sign({
        sub: id,
        iss: 'App',
        iat: new Date().getTime(),
    }, jwtSecret, { expiresIn: '10000s' })
}


//function check phone regular exression 
//this function support 
// +XX-XXXX-XXXX  
// +XX.XXXX.XXXX  
// +XX XXXX XXXX 
const checkPhone = inputtxt => {
    var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (inputtxt.match(phoneno)) {
        return true;
    }
    else {
        throw new Error("invalid phone")
    }
}

const validateEmail = email => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email)) {
        return true
    } else {
        throw new Error("invalid email")
    }
}

export default {
    //validation on request parameter during sinup route
    validateBody(isUpdate = false) {
        return [
            body("email").exists().withMessage("Email is required")
                .isEmail().withMessage("Email is invalid syntax")
                .custom(async (value, { req }) => {
                    let user = await User.findOne({ email: value });
                    if (!user)
                        return true
                }).withMessage('email exist before'),
            body("name").exists().withMessage("name is required"),
            body("password").exists().withMessage("password is required"),
            body("phone").exists().withMessage("phone is requires")
                .custom(async (value, { req }) => {
                    let user = await User.findOne({ phone: value });
                    if (!user)
                        return true
                }).withMessage('phone exist before'),
        ];
    },

    async signup(req, res, next) {
        const validationErrors = validationResult(req).array();
        if (validationErrors.length > 0)
            return next(new ApiError(422, validationErrors));
        try {
            if (req.file)
                req.body.img = await toImgUrl(req.file);
            let createdUser = await User.create(req.body);
            let newUser = await User.findById(createdUser.id)
                .populate('country')
            res.status(201).send({ userDetails: newUser, token: generateToken(createdUser.id) });
        } catch (err) {
            next(err);
        }
    },
    //signin logic function 
    async signin(req, res, next) {
        let user = req.user; // Passport
        let userDetails = await User.findById(user.id)
            .populate('country notificationPlan userPlan')
        res.send({ userDetails, token: generateToken(user.id) });
    },
    //check email is exist or not 
    async checkEmail(req, res, next) {
        if (!req.body.email)
            return next(new ApiError(422, 'email is required'))
        let email = req.body.email;
        try {
            validateEmail(email);
            let user = await User.findOne({ email: email });
            if (user)
                return res.status(200).json({ unique: false })
            else
                return res.status(200).json({ unique: true })

        } catch (err) {
            next(err)
        }
    },
    //check if phone is valid or not
    async checkPhone(req, res, next) {
        if (!req.body.phone)
            return next(new ApiError(422, 'phone is required'));
        let phone = req.body.phone;
        try {
            checkPhone(phone)
            let user = await User.findOne({ phone: phone });
            if (!user)
                return res.status(200).json({ unique: true })
            else
                return res.status(200).json({ unique: false })
        } catch (err) {
            next(err)
        }
    },


    //validation on request parameter during sinup route
    validateUpdate(isUpdate = true) {
        return [
            body("email").isEmail().withMessage("Email is invalid syntax")
                .custom(async (value, { req }) => {
                    let userQuery = { email: value };
                    if (isUpdate && req.user.email === value)
                        userQuery._id = { $ne: req.user._id };

                    let user = await User.findOne(userQuery);
                    if (user)
                        throw new Error('email already exists');
                    else
                        return true;
                }),
            body("phone")
                //make custome validation to phone to check on phone[unique, isPhone]
                .custom(async (value, { req }) => {
                    //call phone checking pattren function 
                    checkPhone(value);
                    if (isUpdate && req.user.phone == value)
                        userQuery._id = { $ne: req.user._id };
                    let userPhoneQuery = { phone: value };
                    let user = await User.findOne(userPhoneQuery);
                    if (user)
                        throw new Error('phone already exists');
                    else
                        return true
                })
        ];
    },
    //update profile of user 
    async updateProfile(req, res, next) {
        const id = req.params.userId;
        let ourUser = await User.findById(id)
        if (req.file) {
            req.body.img = await toImgUrl(req.file);
        } else {
            req.body.img = ourUser.img
        }
        if (!(req.user.id == ourUser.id)) {
            return next(new ApiError(422, "don't have access to resourse"));
        }
        try {
            if (req.body.phone) {
                checkPhone(req.body.phone)
            }

            if (req.body.email) {
                validateEmail(req.body.email)
            }

            let newObje = await User.findByIdAndUpdate(id, req.body, { new: true });
            let populatedUser = await User.findById(newObje.id)
                .populate('country')
                .populate('userPlan')
                .populate('notificationPlan')
            return res.status(200).send(populatedUser);
        } catch (err) {
            next(err)
        }

    },
}
