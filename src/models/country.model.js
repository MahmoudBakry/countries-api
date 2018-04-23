import mongoose, { Schema } from "mongoose";
import autoIncrement from 'mongoose-auto-increment';
const CountrySchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});

CountrySchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;

        delete ret._id;
        delete ret.__v;
    }
});
autoIncrement.initialize(mongoose.connection);
CountrySchema.plugin(autoIncrement.plugin, { model: 'country', startAt: 1 })

export default mongoose.model("country", CountrySchema);