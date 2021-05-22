"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  comments: [String],
});

const Book = mongoose.model("Book", bookSchema);

module.exports = function (app) {
  app
    .route("/api/books")
    .get(function (req, res) {
      Book.find({}, function (err, books) {
        if (err) return console.error(err);
        let booksArray = books.map((book) => {
          return {
            _id: book._id,
            title: book.title,
            commentcount: book.comments.length,
          };
        });
        res.json(booksArray);
      });
    })

    .post(function (req, res) {
      let title = req.body.title;
      if (!title) return res.send("missing required field title");

      const bookDoc = new Book({ title: req.body.title });
      bookDoc.save((err, newBook) => {
        if (err) return console.error(err);
        res.json({ title: newBook.title, _id: newBook._id });
      });
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;

      Book.findById(bookid, (err, bookDoc) => {
        if (bookDoc) {
          res.json({
            title: bookDoc.title,
            _id: bookDoc._id,
            comments: bookDoc.comments,
          });
        } else {
          res.send("no book exists");
        }
      });
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!req.body.comment) return res.send("missing required field comment");

      Book.findById(bookid, (err, bookDoc) => {
        if (bookDoc) {
          bookDoc.comments.push(comment);
          bookDoc.save((err, updatedBook) => {
            res.json({
              title: updatedBook.title,
              _id: updatedBook._id,
              comments: updatedBook.comments,
            });
          });
        } else {
          res.send("no book exists");
        }
      });
    })

    .delete(function (req, res) {
      let bookid = req.params.id;

      Book.findOneAndDelete({ _id: bookid }, function (err, deletedBook) {
        if (err) return console.error(err);
        if (!deletedBook) return res.send("no book exists");
        res.send("delete successful");
      });
    });
};
