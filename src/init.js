var mongoose = require("mongoose");
const { posts, replies, config } = require("./../models")
var appTitle = process.env.APP_TITLE || "Bulletin Board"

async function Database() {

var serverConfiguration = await config.find({_id: 0});
var serverConfig = serverConfiguration[0]

if(!serverConfig) { 
    console.log(`Database Init - Creating Server Configuration`)
    await config.create({
        _id: 0,
        readonly: false,
        ipProtection: true,
        ipProtectionBlock: false,
        refererProtection: true,
        refererProtectionBlock: false,
    }).then(r => {
        console.log("Database Init - Added Server Configuration")
    }).catch(e => {
        console.log(e);
    })
}

if(serverConfig) {

    if(!serverConfig["readonly"]) {
        await config.updateOne({_id: 0}, { readonly: false}).then(r => {
            console.log(`Database Init - Added readonly to Server Configuration`)
        }).catch(e => {
            console.log(e);
        });
    };

    if(!serverConfig["ipProtection"]) {
        await config.updateOne({_id: 0}, { ipProtection: true}).then(r => {
            console.log(`Database Init - Added ipProtection to Server Configuration`)
        }).catch(e => {
            console.log(e);
        });
    };

    if(!serverConfig["ipProtectionBlock"]) {
        await config.updateOne({_id: 0}, { ipProtectionBlock: false}).then(r => {
            console.log(`Database Init - Added ipProtectionBlock to Server Configuration`, r)
        }).catch(e => {
            console.log(e);
        });
    };

    if(!serverConfig["refererProtection"]) {
        await config.updateOne({_id: 0}, { refererProtection: true}).then(r => {
            console.log(`Database Init - Added refererProtection to Server Configuration`)
        }).catch(e => {
            console.log(e);
        });
    };

    if(!serverConfig["refererProtectionBlock"]) {
        await config.updateOne({_id: 0}, { refererProtectionBlock: false}).then(r => {
            console.log(`Database Init - Added refererProtectionBlock to Server Configuration`)
        }).catch(e => {
            console.log(e);
        });
    };

}

await addDefaultPosts();

}

async function addDefaultPosts() {
    var postsCount = await posts.countDocuments({});

    if(postsCount == 0) {
        console.log(`Database - Adding Default Posts and Replies`)

        var defaultSet = [
            {
                id: "example-default",
                title: "[Default] Example",
                poster: "Example Poster",
                content: "Example Default Post",
                readonly: true,
                hidden: true,
                replies: [
                    { id: "example-1", poster: "Example Poster", content: "Example Default Post Reply" }
                ]
            }
        ]

        // Default Posts and Replies
        let id = 0;
        defaultSet.forEach(async (d) => {
            // Post
            await posts.create({
                _id: d["id"],
                title: d["title"],
                poster: d["poster"],
                content: d["content"],
                readonly: d["readonly"],
                hidden: d["hidden"],
                server: true
            }).then(r => {
                console.log(`Database - Added Default Post - ${d["id"]}`);
            }).catch(e => {
                console.log(e);
            });

                // Replies
                d["replies"].forEach(async (dr) => {
                    await replies.create({
                        _id: dr["id"],
                        postId: d["id"],
                        poster: dr["poster"],
                        content: dr["content"],
                        server: true
                    }).then(r => {
                        console.log(`Database - Added Default Post Reply - ${d["id"]} - ${dr["id"]}`)
                    }).catch(e => {
                        console.log(e);
                    });
                });

        });


    };

}

async function destroyPosts() {
    await posts.deleteMany({}).then(r => {
        console.log(`Database - Deleted ${r["deletedCount"]} Posts`);
    }).catch(e => {
        console.log(e);
    })

    await replies.deleteMany({}).then(re => {
        console.log(`Database - Deleted ${re["deletedCount"]} Replies`);
    }).catch(e => {
        console.log(e);
    })

    await addDefaultPosts();
}


module.exports = {
    Database: Database,
    destroyPosts: destroyPosts
}