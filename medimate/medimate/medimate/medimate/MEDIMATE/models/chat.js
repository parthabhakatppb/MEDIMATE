const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    doc: {
        type: String,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
});

module.exports = mongoose.model("chat", chatSchema);