//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const saltRound = 10;

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://80.249.163.147:32770/db_blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const postSchema = {
  title: String,
  content: String
};

const userSchema = {
  email: String,
  password: String
};

const Post = mongoose.model("Post", postSchema);
const User = mongoose.model("User", userSchema);

// const testPost = new Post({
//   title: "Teszt",
//   content: "Áj kent get no szetisfeksön"
// });
// testPost.save();

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });

  });
});

app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/login", function (req, res) {
  res.render("login");
});


//////////////////////////////////////////////Register page
// app.get("/register", function (req, res) {
//   res.render("register")
// });



//To login
app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({
    email: username
  }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function (err, result) {
          if (result === true) {
            res.render("compose");
          }
        })
      }
    }
  })
})


//To register
// app.post("/register", function (req, res) {
//   bcrypt.hash(req.body.password, saltRound, function (err, result) {
//     const newUser = new User({
//       email: req.body.username,
//       password: result
//     })
//     newUser.save()
//     res.redirect("/");
//   })
// })

app.post("/compose", function (req, res) {
  // console.log(req.body.postTitle, req.body.postBody)
  const postTitle = req.body.postTitle;
  const postBody = req.body.postBody;

  const post = new Post({
    title: postTitle,
    content: postBody
  });

  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });

  // const post = {
  //   consttitle: req.body.postTitle,
  //   content: req.body.postBody
  // };

  // posts.push(post);

  res.redirect("/");
});

app.get("/posts/:postId", function (req, res) {
  const idOfPost = req.params.postId;
  Post.findOne({
      _id: idOfPost
    },
    function (err, wantedList) {
      if (!err) {
        res.render("post", {
          title: wantedList.title,
          content: wantedList.content
        });
      }
    }
  );
});

app.delete("/posts/:postName", function (req, res) {
  const postName = req.params.postName;
  Post.deleteMany({
      title: postName
    },

    function (err) {
      if (err) {
        console.log(err)
      } else {
        res.send("Post has been deleted")
      }
    });

})

// app.get("/posts/:postId", function (req, res) {
//   const requestedTitle = _.lowerCase(req.params.postName);

//   posts.forEach(function (post) {
//     const storedTitle = _.lowerCase(post.title);

//     if (storedTitle === requestedTitle) {
//       res.render("post", {
//         title: post.title,
//         content: post.content
//       });
//     }
//   });

// });

app.listen(3001, function () {
  console.log("Server started on port 3001");
});