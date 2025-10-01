// routes/mybooks.js
const express = require("express");
const { ensureLoggedIn } = require("../middleware/auth");
const UserBook = require("../models/UserBook");
const router = new express.Router();
const db = require("../db");



router.post("/", ensureLoggedIn, async function (req, res, next) {

  try {
    const userId = res.locals.user?.id;
    const { bookId, status = "Want to Read", progress = 0 } = req.body;

    console.log(" POST /mybooks called out");
    console.log(" userId:", userId);
    console.log(" bookId:", bookId, "status:", status, "progress:", progress);

    if (!bookId) {
      return res.status(400).json({ error: "bookId is required" });
    }
    const added = await UserBook.addBook({ userId, bookId, status, progress });

    return res.status(201).json({ added }); 
  } catch (err) {
    return next(err);
  }
});

/**GET /mybooks */
router.get("/", ensureLoggedIn, async function (req, res, next) {
  try {
 
    const userId = res.locals.user.id;
    const books = await UserBook.getMyBooks({ userId });
    return res.json({ books });
  } catch (err) {
    console.error("❌ 에러 발생:", err);
    return next (err)
  }
})

router.post("/:book_id", ensureLoggedIn, async function (req, res, next) {
  try {
    console.log("Reach to the mybooks/post")
    console.log("req.params:",req.params)
    const userId = res.locals.user.id;
    const bookId  = req.params.book_id;
    console.log(`😀user id: ${userId}`)
    console.log(`📖book id: ${bookId}`)
    await UserBook.addBook({ userId, bookId } );
    return res.json({ added: bookId });
  } catch (err) {
    return next(err);
  }
  
})

/** DELETE /mybooks/:bookId  */
router.delete("/:bookId", ensureLoggedIn, async function (req, res, next) {
  try {
    const userId = res.locals.user.id;
    const { bookId } = req.params;

    await UserBook.removeBook(userId, bookId);
    return res.json({ deleted: bookId });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /mybooks/:book_id
 * Update status, progress, and review for a user's book
 */
router.patch("/:book_id", ensureLoggedIn, async function (req, res, next) {
  try {
    const userId = res.locals.user.id;
    const { book_id } = req.params;
    const { status, progress, review } = req.body;

    const result = await db.query(
      `UPDATE user_books
       SET status = $1,
           progress = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $3 AND book_id = $4
       RETURNING book_id, status, progress`,
      [status, progress, userId, book_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Book not found for user." });
    }

    return res.json({ book: result.rows[0] });
  } catch (err) {
    console.error("Patch error:", err)
    return next(err);
  }
});

module.exports = router;
