import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config"; // VITE_BACKEND_URL || "http://localhost:5000"

const SEARCH_BASE_URL = import.meta.env
export default function Practice({ limit = 6, excludeSelf = false }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setErr("");

      const url = `${BASE_URL}/reviews`;         
      const params = { limit, excludeSelf };

      try {
        const res = await axios.get(url, { params }); // 쿠키/토큰 불필요
        if (!ignore) setReviews(res.data?.reviews ?? []);
      } catch (e) {
        console.error("리뷰 불러오기 실패:", e);
        const status = e?.response?.status;
        const body =
          typeof e?.response?.data === "string"
            ? e.response.data.slice(0, 200)
            : JSON.stringify(e?.response?.data || {}).slice(0, 200);
        if (!ignore) setErr(`[${status ?? "ERR"}] ${e.message} ${body}`);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => { ignore = true; };
  }, [limit, excludeSelf]);

  if (loading) return <div>Loading</div>;
  if (err) return <div>Error: {err}</div>;
  if (reviews.length === 0) return <div>No review to show</div>;

  return (
    <div>
      <h2>latest review</h2>
      <ul>
        {reviews.map((r) => (
          <li key={r.id}>
            <b>{ r.book_id}</b><br />
            <b>@{r.username}</b> ({r.rating ?? "-"})<br />
            {r.comment?.trim() || "(no comment)"}<br />
            {r.created_at && <small>{new Date(r.created_at).toLocaleDateString()}</small>}<br />
          </li>
        ))}
      </ul>
    </div>
  );
}
