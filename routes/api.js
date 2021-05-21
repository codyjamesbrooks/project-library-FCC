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
      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
};
