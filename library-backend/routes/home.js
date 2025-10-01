// routes/home.js
const express = require('express');
const router = new express.Router();
const db = require('../db');

// 로그인은 “선택적”으로만 사용: res.locals.user?.id 가 있을 수도, 없을 수도.
router.get('/reviews', async (req, res, next) => {
  try {
    const me = res.locals.user?.id || null;

    // limit: 기본 6, 최대 12로 클램프
    let limit = Number(req.query.limit) || 6;
    if (isNaN(limit) || limit < 1) limit = 6;
    if (limit > 12) limit = 12;

    const excludeSelf =
      String(req.query.excludeSelf || '').toLowerCase() === 'true';

    // 동적으로 파라미터 구성
    const params = [];
    let where = '';
    if (excludeSelf && me) {
      params.push(me);
      where = `WHERE r.user_id <> $${params.length}`;
    }

    params.push(limit);

    const q = `
      SELECT r.book_id,
             r.rating,
             COALESCE(r.comment, '') AS comment,
             r.created_at,
             u.username
        FROM reviews r
        JOIN users u ON u.id = r.user_id
        ${where}
       ORDER BY r.created_at DESC
       LIMIT $${params.length}
    `;

    const result = await db.query(q, params);
    return res.json({ reviews: result.rows });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;