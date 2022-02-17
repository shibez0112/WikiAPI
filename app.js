//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewURLParser: true});

const articlesSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articlesSchema);

app.route("/articles")

.get(function(req,res){
    Article.find({}, function(err, foundArticles){
        if (err){
            res.send(err);
        }
        else {
            res.send(foundArticles);
        }
    })
})

.post(function(req,res){
    article_title = req.body.title;
    article_content = req.body.content;

    Article.find({tile: article_title}, function(err, foundArticles){
        if (err){
            res.send(err)
        }
        else if (foundArticles === 1){
            res.send("Article already exists")
        }
        else{
            new_article = new Article({
                title: article_title,
                content: article_content
            });
            new_article.save();
            res.send("Sucessfully save article")
        }
    })
})

.delete(function(req,res){
    Article.deleteMany({}, function(err){
        if (err){
            res.send(err);
        }
        else {
            res.send("Sucessfully delete all articles");
        }
    })
});

app.route("/articles/:articleTitle")

.get(function(req,res){
    Article.find({title: req.params.articleTitle}, function(err, foundArticle){
        if (err){
            res.send(err);
        }
        else {
            res.send(foundArticle);
        }
    });
})

.put(function(req,res){

    Article.updateOne({title: req.params.articleTitle},
        {$set: {title: req.body.title, content: req.body.content}},
        function(err){
        if (err){
            res.send(err);
        }
        else {
            res.send("Update articles sucessfully");
        }
    });
})

.patch(function(req,res){
    Article.updateOne({title: req.params.articleTitle},
        {$set: req.body},
        function(err){
        if (err){
            res.send(err);
        }
        else {
            res.send("Update articles sucessfully");
        }
    });
})

.delete(function(req,res){
    Article.deleteMany({title:req.params.articleTitle}, function(err){
        if (err){
            res.send(err);
        }
        else {
            res.send("Sucessfully delete all articles");
        }
    })
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});