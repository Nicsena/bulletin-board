require("dotenv").config();

const express = require("express");
const app = express();
const rateLimit = require("express-rate-limit");
const path = require('path');
const cookieParser = require('cookie-parser')
const { posts, replies } = require("./models")
const init = require("./src/init");
const moment = require("moment")

var persistent = process.env.PERSISTENT || true

var PORT = process.env.PORT || 3000;
var appTitle = process.env.APP_TITLE || "Bulletin Board"

// ===== MongoDB =====
var mongoose = require("mongoose");
var db_username = process.env.MONGODB_USERNAME;
var db_password = process.env.MONGODB_PASSWORD;
var db_address = process.env.MONGODB_SERVER;
var db_name = process.env.MONGODB_DATABASE;
var db_url = `mongodb://${db_username}:${db_password}@${db_address}/${db_name}?retryWrites=true&w=majority`;

mongoose.connect(db_url, {
    useNewUrlParser: true,
    dbName: `${db_name}`,
    useUnifiedTopology: true,
  }
);

var mongodb_db = mongoose.connection;

mongodb_db.on("open", async function (ref) {
  console.log("Connected to MongoDB Server: " + db_address);
  await init.Database();
  if(persistent === "false") await init.destroyPosts();
});

mongodb_db.on("close", function () {
  console.log("Disconnected from MongoDB Server: " + db_address);
});

mongodb_db.on("error", function (err) {
  console.log("Unable to connect to MongoDB Server: " + db_address);
  console.log(err);
});


// ===================



const RateLimit = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 Minutes
    max: 10000, // Start blocking after 10000 requests
    standardHeaders: true,
    message: async (req, res) => {
        res.status(429).json({
            message: "You are being rate-limited. Please try again later."
        })
    }
});

  
app.use(RateLimit);
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'public'));
app.enable("trust proxy");

app.all("*", async (req, res, next) => {
    var IP = req.ip;
    var timestring = new Date().toLocaleString()
    var UserAgent = req.get('User-Agent')
    var Path = req.path
    var Method = req.method
    var Referer = (req.headers["referer"] || "").split('/')[2] || "No Referer"

    console.log(`${timestring} - ${IP} - ${Method} - ${Path} - ${UserAgent} - ${Referer}`);

    next();

});

app.get("/", (req, res) => {
    res.status(200).render(__dirname + "/views/index.ejs", { title: appTitle })
});

app.get("/bulletin_api", (req, res) => {
    res.status(200).render(__dirname + "/views/bulletin_api.ejs", { title: appTitle })
});

app.get("/ping", (req, res) => {
    res.status(200).json({
        message: "pong!"
    })
});

app.get("/new", (req, res) => {
    res.status(200).render(__dirname + "/views/new.ejs", { title: appTitle })
});

app.get("/posts", async (req, res) => {
    var postsL = await posts.find({ hidden: false });
    let postsList = []
    var repliesAmount = await replies.find({});
    postsL.forEach(p => {

        if(p["hidden"] === "true") return;

        let postFormat = {
            id: p["_id"],
            title: p["title"],
            content: p["content"],
            createdAt: moment(p["createdAt"]).format('MM/DD/YYYY hh:mm:ss A'),
            repliesAmount: (repliesAmount.filter(reply => reply.postId == p["id"])).length,
            readonly: p["readonly"],
            hidden: p["hidden"],
            server: p["server"]
        }
        postsList.push(postFormat)
     })

    res.status(200).render(__dirname + "/views/posts.ejs", { title: appTitle, posts: postsList.reverse() })
});

app.get("/posts/:id", async (req, res) => {
    var id = req.params.id
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    if(!id || id == null) return res.status(404).render(__dirname + "/views/404.ejs", { title: appTitle })

    try {
        var post = await posts.findOne({_id: id, hidden: false})
        var postReplies = await replies.find({postId: id});

        if(!post) return res.status(404).render(__dirname + "/views/404.ejs", { title: appTitle })

        if(post) {
            let replies = []
            let postFormat = {
                title: post["title"],
                content: post["content"],
                createdAt: moment(post["createdAt"]).format('MM/DD/YYYY hh:mm:ss A'),
                readonly: post["readonly"],
                hidden: post["hidden"],
                server: post["server"]
            }

            postReplies.forEach(r => {
            let replyFormat = {
                id: r["_id"],
                postId: r["postId"],
                poster: r["poster"],
                content: r["content"],
                createdAt: moment(r["createdAt"]).format('MM/DD/YYYY hh:mm:ss A'),
                link: `${fullUrl}#reply-${r["postId"]}-${r["_id"]}`,
                server: r["server"]
            }
            replies.push(replyFormat)
            })
            return res.status(200).render(__dirname + "/views/post.ejs", { title: appTitle, post: postFormat, replies: replies.reverse() })
        }

    } catch(e) {
    console.log(e);
    res.status(500).render(__dirname + "/views/500.ejs", { title: appTitle })
    }

});

const APIRoute = require("./routes/api");
app.use("/api", APIRoute)

app.get("*", async (req, res) => {
    return res.status(404).render(__dirname + "/views/404.ejs", { title: appTitle })
});

app.listen(PORT, (err) => {
    if (err) console.error(err);
    if (!err) console.log(`Server is now listening on ${PORT}`);
})