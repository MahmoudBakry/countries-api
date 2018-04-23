import express from "express";
import userRoute from "./user.route";
import countryRoute from './country.route';
import cityRoute from './city.route';
import regionRoute from './region.route';
import passport from "passport";

//import seenRouter from './seenCount.route'
const requireAuth = passport.authenticate('jwt', { session: false });
const router = express.Router();
router.use("/", userRoute);
router.use("/countries", countryRoute)
//this protected by token ==> private
export default router;
