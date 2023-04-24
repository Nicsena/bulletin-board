const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
const { posts, replies, config } = require("./../models");

router.get("/", (req, res) => {
    console.log(req.path)
    res.status(200).json({
        message: "API - OK"
    });
})

router.get("/posts/", async (req, res) => {

    let postsList = await posts.find({ server: false, hidden: false });

    if(!postsList) return res.status(200).json({
        message: "There are no posts at the moment."
    })


    if(postsList) {
        let list = []

        postsList.forEach((p) => {
            list.push({
                id: p["id"],
                poster: p["poster"],
                title: p["title"],
                content: p["content"],
                createdAt: p["createdAt"]
            })
        })

        return res.status(200).json(list)

    };

})

router.get("/replies/:id", async (req, res) => {
    var postId = req.params.id

    let post = await posts.findOne({ _id: postId, hidden: false});
    let repliesList = await replies.find({postId: postId});

    if(!post) return res.status(404).json({
        message: "Post not found or doesn't exist."
    });

    if(post) {

        let list = []

        repliesList.forEach(r => {
            list.push({
                id: r["_id"],
                postId: r["postId"],
                poster: r["poster"],
                content: r["content"],
                createdAt: r['createdAt']
            })
        });

        res.status(200).json(list)

    }

})

router.get("/post/:id", async (req, res) => {
    var postId = req.params.id

    let post = await posts.findOne({_id: postId, hidden: false});

    if(!post) return res.status(404).json({
        message: "Post not found or doesn't exist."
    });

    if(post) return res.status(200).json({
        id: post["_id"],
        poster: post["poster"],
        title: post["title"],
        content: post["content"],
        createdAt: post['createdAt']
    });

})

router.get("/reply/:id", async (req, res) => {
    var replyId = req.params.id

    let reply = await replies.findOne({_id: replyId});

    if(!reply) return res.status(404).json({
        message: "Reply not found or doesn't exist."
    });

    if(reply) return res.status(200).json({
        _id: reply["_id"],
        postId: reply["postId"],
        poster: reply["poster"],
        content: reply["content"],
        createdAt: reply['createdAt']
    });

})


router.post('/create', async (req, res) => {

    var title = req.body["title"];
    var content = req.body["body"]
    var poster = req.body["poster"] || "Anonymous";

    if (!title) {
        return res.status(400).json({
            error: true,
            message: "Please put a post title"
        });
    }

    if(!content) {
        return res.status(400).json({
            error: true,
            message: "Please put a post description"
        });
    }

    var c = await config.find({_id: 0})
    if(c[0]["readonly"] === "true") {
        return res.status(400).json({
            error: true,
            message: "Server is in read-only mode."
        });
    };

    if(title && content) {
        let postsCount = await posts.countDocuments();
        let date = new Date().toISOString()

        await posts.create({
            _id: postsCount,
            title: title,
            content: content,
            createdAt: date,
            poster: poster,
        }).then((result) => {
            return res.status(201).json({
                error: false,
                message: "Success - Posted!",
                postId: postsCount
            });
        }).catch(e => {
            console.log(e);
            return res.status(500).json({
                error: true,
                message: "An Internal Server Error occurred"
            })
        })
    }

});


router.post("/create/reply", async (req, res) => {
    var postId = req.body["postId"]
    var content = req.body["content"]
    var poster = req.body["poster"] || "Anonymous"

    if (!content) return res.status(400).json({
        error: true,
        message: "Please put a reply descrpition"
    });

    if(!postId) {
        return res.status(400).json({
            error: true,
            message: "Please put a post ID."
        });
    }

    var c = await config.find({_id: 0})
    if(c[0]["readonly"] === "true") {
        return res.status(400).json({
            error: true,
            message: "Server is in read-only mode."
        });
    };

    var post = await posts.findOne({_id: postId})

    if(!post) {
        return res.status(404).json({
            error: true,
            message: "Post doesn't exist"
        });
    }

    if(post["readonly"] === "true") {
        return res.status(400).json({
            error: true,
            message: "This post is read-only."
        });
    };

    var repliesCount = await replies.countDocuments({ server: false });

    if(content && postId) {
        let date = new Date().toISOString()

        await replies.create({
            _id: repliesCount,
            postId: postId,
            poster: poster,
            content: content,
            createdAt: date
        }).then(result => {
            res.status(201).json({
                error: false,
                message: "Success - Posted Reply!"
            })
        }).catch(e => {
            console.log(e);
            res.status(500).json({
                error: true,
                message: "An Internal Server Error occurred!"
            })
        })
    };

});

router.get("*", async (req, res) => {

    return res.status(404).json({
        message: "Endpoint Not Found"
    })

});


module.exports = router