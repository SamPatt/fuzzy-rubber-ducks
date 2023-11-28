const { restart } = require("nodemon");
const Post = require("../models/post");
const Profile = require("../models/profile");

module.exports = {
  index,
  show,
  delete: deletePost,
  addComment,
  create,
  deleteComment,
};

async function index(req, res) {
  try {
    const posts = await Post.find();

    res.render("fuzzies/posts/index", {
      title: "All Posts",
      posts: posts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
}

async function create(req, res) {
  try {
    req.body.profile = req.user.profiles[0]._id;
    const profile = await Profile.findById(req.user.profiles[0]._id);
    req.body.petName = profile.petName;
    req.body.profilePhoto = profile.petPhoto.profilePhoto;
    const post = await Post.create(req.body);
    console.log(post);

    res.redirect("/posts/");
  } catch (err) {
    console.log(err);
  }
}

async function show(req, res) {
  try {
    const currentProfile = req.user.profiles[0]._id;
    const post = await Post.findById(req.params.id);
    res.render("fuzzies/posts/show", {
      title: post.petName,
      post: post,
    });
  } catch (err) {
    console.log(err);
  }
}

async function addComment(req, res) {
  try {
    const profile = await Profile.findById(req.user.profiles[0]._id);
    req.body.petName = profile.petName;
    const post = await Post.findById(req.params.id);
    console.log(post);
    console.log(req.body);
    //creating profile id key for the form
    req.body.profileId = req.user.profile[0]._id
    post.postComments.push(req.body);
    await post.save();
    res.redirect("/posts");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
}

async function deleteComment(req, res) {
  try {
    const profile = await Profile.findById(req.user.profiles[0]._id);
    req.body.petName = profile.petName;
    const post = await Post.findById(req.params.id);
    console.log("this is my req.params", req.body.currentProfile);
    console.log("this is id from oauth", req.user.profiles[0]._id.toString());
    //by assigning a variable we can reach
    //to the input variable current profile for conditional
    //statement both here and condition in ejs
    const currentProfile = req.body.currentProfile;
    console.log(currentProfile);
    if (currentProfile === req.user.profiles[0]._id.toString()) {
      console.log(req.body);
      console.log(post.postComments);
      console.log("this is req params id", req.params.id);
      console.log("index of ", post.postComments.indexOf(req.params.id));
      post.postComments.forEach(function (postComment, index) {
        console.log(postComment, index);
        console.log(post._id.toString());
        console.log(req.params.id);
        if (post._id.toString() === req.params.id) {
          post.postComments.splice(index, 1);
        }
      });
      
      await post.save();
      const posts = await Post.find({ profile: req.user.profiles[0] });
      res.render("fuzzies/profiles/show", {
        title: profile.petName + "'s Page",
        profile: profile,
        posts: posts,
        currentProfile: currentProfile,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
}

async function deletePost(req, res) {
  try {
    const post = await Post.deleteOne({ _id: req.params.id });
    const profile = await Profile.findById(req.user.profiles[0]._id);
    const posts = await Post.find({ profile: profile._id });
    res.render("fuzzies/profiles/show", {
      title: profile.petName + "'s Page",
      profile: profile,
      posts: posts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
}
