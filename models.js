const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
    _id: { type: Number, required: false },
    readonly: { type: String, required: false }
})

const postSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    poster: { type: String, required: false, default: "Anonymous" },
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now()},
    readonly: { type: String, required: false, default: false },
    hidden: { type: String, required: false, default: false },
    server: { type: String, required: false, default: false }
})

const postReplySchema = new mongoose.Schema({
    _id: { type: String, required: true },
    postId: { type: String, required: true },
    poster: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now()},
    server: { type: String, required: false, default: false }
})

module.exports = {
    config: mongoose.model("Bconfig", configSchema),
    posts: mongoose.model("Bposts", postSchema),
    replies: mongoose.model("Bpostreplies", postReplySchema)
}