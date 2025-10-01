const express = require("express");
const axios = require("axios");
const router = new express.Router();
const bookapi = "https://www.googleapis.com/books/v1/volumes"
// GET /search

router.get("/search", async function (req, res, next) {
  try {
    //q = Full-text query string
    const query = req.query.q
    if (!query) {
      return res.status(400).json({ error: "Search keyword is missing" })
    }

    const response = await axios.get(bookapi, {
      params: {
        q: query,
        maxResults: 10,
      }
    });

    const books = response.data.items.map(book => {
      const info = book.volumeInfo;
      return {
        id: book.id,
        title: info.title,
        authors: info.authors || [],
        description: info.description || "",
        thumbnail: info.imageLinks?.thumbnail || "",
        publishedDate: info.publishedDate || ""
      };
    })
    return res.json({ books });
  } catch (err) {
    return next(err)
  }
})

module.exports = router;