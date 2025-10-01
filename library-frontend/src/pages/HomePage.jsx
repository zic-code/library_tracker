// src/pages/HomePage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config";
import { fetchBookDetail } from "../utils/googleBooks";
import { Container, Row, Col, Card, Button, Form, Spinner, Alert, Stack } from "react-bootstrap";

async function fetchJson(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status} @ ${url}`);
  return r.json();
}

function pickRandomUniqueBookIds(reviews, take = 6) {
  const unique = Array.from(new Set(reviews.map((r) => r.book_id))).filter(Boolean);
  for (let i = unique.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [unique[i], unique[j]] = [unique[j], unique[i]];
  }
  return unique.slice(0, take);
}

export default function HomePage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const [reviews, setReviews] = useState([]);
  const [recBooks, setRecBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let ignore = false;
    const url = `${BASE_URL}/reviews?limit=50&excludeSelf=false`;

    async function load() {
      try {
        const data = await fetchJson(url);
        if (ignore) return;

        const revs = data?.reviews ?? [];
        setReviews(revs);

        const ids = pickRandomUniqueBookIds(revs, 6);
        const details = await Promise.all(ids.map((id) => fetchBookDetail(id).catch(() => null)));

        if (!ignore) {
          const books = details.map((d, i) => d && ({ id: ids[i], ...d.volumeInfo })).filter(Boolean);
          setRecBooks(books);
        }
      } catch (e) {
        if (!ignore) setErr(e.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => { ignore = true; };
  }, []);

  const latest6 = useMemo(
    () => [...reviews].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,6),
    [reviews]
  );

  const onSearch = () => {
    const v = q.trim();
    if (v) navigate(`/search?query=${encodeURIComponent(v)}`);
  };

  return (
    <div style={{ background: "#0b0b0b64" }}>
      {/* HERO */}
      <div className="py-5 text-light hero-surface">
        <Container style={{ position: "relative", zIndex: 1 }}>
          <h1 className="fw-bold mb-2">Find your next book</h1>
          <p className="mb-3 opacity-75">You can search your next book here!</p>
          <Stack direction="horizontal" gap={2} className="justify-content-center">
            <Form.Control
              placeholder="Title / Author / ISBN"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              style={{ maxWidth: 520 }}
            />
            <Button variant="outline-light" className="fw-semibold" onClick={onSearch}>
              Search
            </Button>
            <Button variant="outline-light" onClick={() => navigate("/mybooks")}>
              MyBooks
            </Button>
          </Stack>
        </Container>
      </div>

      <Container className="py-5">
        {/* RECOMMENDATION */}
        <div className="d-flex align-items-center justify-content-center mb-3">
          <h4 className="text-light m-0">Recommendation</h4>
        </div>

        {loading ? (
          <div className="text-center text-light py-5"><Spinner animation="border" /></div>
        ) : err ? (
          <Alert variant="danger">추천 불러오기 실패: {err}</Alert>
        ) : recBooks.length === 0 ? (
          <div className="text-secondary">표시할 책이 없습니다.</div>
        ) : (
<Row
  xs={1} sm={2} md={3} lg={4}
  className="g-4 justify-content-center"
>
  {recBooks.map((b) => {
    const bookReviews = reviews
      .filter(r => r.book_id === b.id)
      .slice(0, 3); // 각 책당 최대 3개 리뷰만
    
    return (
      <Col key={b.id} style={{ maxWidth: "280px" }}>
        <Card
          className="h-100 glass-card border-0"
          onClick={() => navigate(`/books/${b.id}`)}
          role="button"
        >
          {/* 커버 */}
          <div className="book-thumb">
            {b.imageLinks?.thumbnail ? (
              <img src={b.imageLinks.thumbnail} alt={b.title} />
            ) : (
              <div className="thumb-fallback">No cover</div>
            )}
          </div>

          {/* 제목/저자 */}
          <div className="p-3">
            <Card.Title as="h6" className="fw-bold text-dark text-truncate" title={b.title}>
              {b.title}
            </Card.Title>
            <Card.Text className="text-muted" style={{ fontSize: "0.9rem" }}>
              {b.authors?.join(", ") || "Unknown Author"}
            </Card.Text>
          </div>

          {/* 리뷰 */}
          {bookReviews.length > 0 && (
            <div className="px-3 pb-3">
              <small className="text-secondary d-block mb-1">Latest Reviews:</small>
              {bookReviews.map((r, idx) => (
                <div key={idx} className="mb-1">
                  <span className="fw-semibold">@{r.username}</span>:
                  <span className="ms-1">{r.comment?.trim() || "(no comment)"}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </Col>
    );
  })}
</Row>

        )}
      </Container>
    </div>
  );
}
