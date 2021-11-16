//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const app = express();

// mongoDB Setup
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/blogDB");

//
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// mongoose Setup
const postTitle = {
	name: String,
};
const postSchema = {
	//질문: key값과 value는 어떤 기준으로 정하는가?, post title을 이후에 사용하기 위해 분류해야하는가?
	title: String,
	content: String,
};

// You’ll need to create a new mongoose model using the schema to define your posts collection.
const Post = mongoose.model("Post", postSchema);

// Glabal Variable - posts[]
// let posts = [];

// Default List
const homeStartingContent =
	"Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
	"Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
	"Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// render home -> homeStartingContents

app.get("/", function (req, res) {
	Post.find({}, function (err, posts) {
		res.render("home", {
			startingContent: homeStartingContent,
			posts: posts,
		});
	});
	//// Original
	// res.render("home", {
	// 	homeStartingContent: homeStartingContent,
	// 	posts: posts,
	// });
	// console.log(posts);
});

// app.post - post[] -> title, content
app.get("/compose", function (req, res) {
	res.render("compose");
});

app.post("/compose", function (req, res) {
	// Inside the app.post() method for your /compose route, you’ll need to create a new post document using your mongoose model. 356
	const post = new Post({
		title: req.body.postTitle,
		content: req.body.postBody,
	});
	post.save(function (err) {
		if (!err) {
			res.redirect("/");
		} else {
			console.log("error to save")
		}
	});
});

// Express Route parameter - requestedTitle & storedTitle

app.get("/posts/:postId", function (req, res) {
	const requestedTitle = _.capitalize(req.params.postName);
	//You’ll need a constant to store the postId parameter value
	const requestedPostId = req.params.postId;
	Post.findOne({ _id: requestedPostId }, function (err, post) {
		res.render("post", {
			title: post.title,
			content: post.content
		});
	});
	// posts.forEach(function (post) {
	// 	const storedTitle = _.capitalize(post.title);
	// 	if (storedTitle === requestedTitle) {
	// 		res.render("post", {
	// 			title: post.title,
	// 			content: post.content,
	// 		});
	// 	}
	// });
});

// render rest pages

app.get("/about", function (req, res) {
	res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
	res.render("contact", { contactContent: contactContent });
});

//
app.listen(3000, function () {
	console.log("Server started on port 3000");
});
