const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    atHospital: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(v);
            },
            message: 'Invalid time format. Use HH:MM (24-hour format)'
        },
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 }, // TTL index, auto-removes documents after expiration
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    }
})

appointmentSchema.pre('validate', function (next) {
    if (!this.date || !this.time) return next(new Error("Date and Time are required"));

    const [hours, minutes] = this.time.split(':').map(Number);
    const expiryDate = new Date(this.date);
    expiryDate.setHours(hours + 1, minutes, 0, 0); // Add 1 hour to the appointment time

    this.expiresAt = expiryDate;
    next();
});

module.exports = mongoose.model("appointment", appointmentSchema);




// how to make a mongoDB document that get's deleted on it's own after an expiry date set with it