const db = require("../db");

class UserBook {

  static async addBook({ userId, bookId, status = "want_to_read", progress = 0 }) {
    console.log("🛠 addBook run");
    console.log({ userId, bookId, status, progress });
  
    try {
      const result = await db.query(
        `INSERT INTO user_books (user_id, book_id, status, progress)
         VALUES ($1, $2, $3, $4)
         RETURNING id, user_id, book_id, status, progress`,
        [userId, bookId, status, progress]
      );
      console.log("✅ INSERT success:", result.rows[0]);
      return result.rows[0];
    } catch (err) {
      console.error("❌ DB INSERT failed:", err);
      throw err; 
    }
  }

  static async getMyBooks({ userId }) {
    console.log(" getMyBooks() run, userId:", userId);
    const result = await db.query(
      `SELECT book_id, status, progress, created_at ,updated_at
      FROM user_books
      WHERE user_id = $1`, [userId]
    );
    return result.rows;
  }

  static async removeBook(userId, bookId) {
    await db.query(
      `DELETE FROM user_books
       WHERE user_id = $1 AND book_id = $2`,
      [userId, bookId]
    );
  }
}






module.exports = UserBook;