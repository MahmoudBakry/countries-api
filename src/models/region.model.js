import mongoose, { Schema } from "mongoose";
import autoIncrement from 'mongoose-auto-increment';
const RegionSchema = new Schema({
    name: {
        type: String,
        required: true,

    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    city: {
        type: Number,
        ref: 'city',
        required: true
    },
});

RegionSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;

        delete ret._id;
        delete ret.__v;
    }
});
autoIncrement.initialize(mongoose.connection);
RegionSchema.plugin(autoIncrement.plugin, {
    model: 'region',
    startAt: 1,
});

export default mongoose.model("region", RegionSchema);