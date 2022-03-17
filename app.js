//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Journal", { useNewUrlParser: true });

const itemsSchmea = {
  name: String,
  content: String
};
const allContent = mongoose.model("allContent", itemsSchmea);
const aboutdb = mongoose.model("aboutdb", itemsSchmea);
const contactdb = mongoose.model("contactdb", itemsSchmea);

const item1 = new allContent({
  name: "Home",
  content: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
});
// item1.save();
const item2 = new aboutdb({
  name: "About",
  content: "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui."
});
// item2.save();
const item3 = new contactdb({
  name: "Contact",
  content: "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero."
});
// item3.save();

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', (req, res) => {
  allContent.find({}, (arr, dataResult) => {
    res.render('home', {postdata: dataResult });
  })
});

app.get('/post/:newPost', (req, res) => {
  var newPosthangedOld1 = _.kebabCase(req.params.newPost);
  var newPosthangedOld = _.lowerFirst(newPosthangedOld1)

  allContent.find({}, (arr, dataResult) => {
    // res.render('home', {postdata: dataResult });
    dataResult.forEach((element) => {
      var newPosthanged1 = _.kebabCase(element.name);
      var newPosthanged = _.lowerFirst(newPosthanged1)
      if (newPosthanged === newPosthangedOld) {
        res.render('post', { pageTitle: element.name, pageContent: element.content });
      }
    })
  })


});

app.get('/about', (req, res) => {
  aboutdb.find({}, (arr, dataResult) => {
    res.render('about', { aboutContents: dataResult });
  })
  
});

app.get('/contact', (req, res) => {
  contactdb.find({}, (arr, dataResult) => {
    res.render('contact', { contactContents: dataResult });
  })
});

app.get('/compose', (req, res) => {
  res.render('compose');
});

app.post('/compose', (req, res) => {
  var dataTitle = req.body.PostTitle;
  var dataContent = req.body.PostData;
  const newitem = new allContent({
    name: dataTitle,
    content: dataContent
  });
  newitem.save();
  res.redirect('/');
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
