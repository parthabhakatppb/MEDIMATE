const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    profileImage:{
        type: String,
        default: "/images/default.jpg"
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: Number,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        enum: {
            values: ['M', 'F'],
            message: '{VALUE} not supported'
        },
        required: true,
        set: v => v.toUpperCase(),
    },
    email: {
        type: String,
        required: true,
    },
    appointments: [
        {
            type: Schema.Types.ObjectId,
            ref: "appointment",
        }
    ],
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userSchema);