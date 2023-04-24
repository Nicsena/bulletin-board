const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
    _id: { type: Number, required: false },
    readonly: { type: String, required: false, default: false },
    refererProtection: { type: String, required: false, default: true },
    refererProtectionBlock: { type: String, required: false, default: false },
    ipProtection: { type: String, required: false, default: true },
    ipProtectionBlock: { type: String, required: false, default: false }
})

const ipSchema = new mongoose.Schema({
    ip: { type: String, required: true },
    status: { type: String, required: true }
})

const refererSchema = new mongoose.Schema({
    referer: { type: String, required: true },
    status: { type: String, required: true }
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
    ipList: mongoose.model("Bips", ipSchema),
    referersList: mongoose.model("Breferers", refererSchema),
    config: mongoose.model("Bconfig", configSchema),
    posts: mongoose.model("Bposts", postSchema),
    replies: mongoose.model("Bpostreplies", postReplySchema)
}