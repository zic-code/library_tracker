import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import BASE_URL from "../config";
import {
  Container,
  Card,
  ProgressBar,
  Form,
  Button,
  Badge,
} from "react-bootstrap";
import StarRating from "../components/StarRating";
const SEARCH_BASE_URL = import.meta.env.VITE_SEARCH_BASE_URL;




function BookDetailPage() {
  const { book_id } = useParams();
  const { token, username } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookInfo, setBookInfo] = useState(null);
  const [status, setStatus] = useState("reading");
  const [progress, setProgress] = useState(0);
  const [createdAt, setCreatedAt] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [myReview, setMyReview] = useState(null);
  const [otherReviews, setOtherReviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!token) return navigate("/login");
    if (!username) return;

    fetchDetails();
    fetchReviews();
  }, [book_id, token, username]);

  async function fetchDetails() {
    try {
      const bookRes = await axios.get(
        `${SEARCH_BASE_URL}/${book_id}`
      );
      setBookInfo(bookRes.data.volumeInfo);
      setTotalPages(bookRes.data.volumeInfo.pageCount)
      const userRes = await axios.get(`${BASE_URL}/mybooks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const book = userRes.data.books.find((b) => b.book_id === book_id);
      if (book) {
        setStatus(book.status);
        setProgress(book.progress);
        setCreatedAt(book.created_at);
      }
    } catch (err) {
      console.error("Failed to load book info:", err);
    }
  }

  async function fetchReviews() {
    try {
      const res = await axios.get(`${BASE_URL}/reviews/${book_id}`);
      const all = res.data.reviews;
      const mine = all.find((r) => r.username === username);
      const others = all.filter((r) => r.username !== username);
      setMyReview(mine || null);
      setOtherReviews(others);
      if (mine) {
        setRating(mine.rating);
        setComment(mine.comment);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    }
  }

  function handleProgressChange(val) {
    const value = Number(val);
    setProgress(value);
    if (value === 0) setStatus("want_to_read");
    else if (value === 100) setStatus("completed");
    else setStatus("reading");

  }

  async function handleSave() {
    try {
      await axios.patch(`${BASE_URL}/mybooks/${book_id}`, {
        progress,
        status,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Saved!");
    } catch {
      alert("Failed to save progress/status");
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this book from your library?")) return;
    try {
      await axios.delete(`${BASE_URL}/mybooks/${book_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Deleted");
      navigate("/mybooks");
    } catch {
      alert("Failed to delete book");
    }
  }

  async function handleReviewSave() {
    try {
      if (myReview) {
        //if my review exist => POST
        await axios.patch(
          `${BASE_URL}/reviews/${book_id}`,
          { rating, comment },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // if my review exist => POST
        await axios.post(
          `${BASE_URL}/reviews/${book_id}`,
          { rating, comment },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setIsEditing(false);
      await fetchReviews();
    } catch {
      alert("Failed to save review");
    }
  }
  const currentPage = Math.round((progress / 100) * totalPages);
  if (!bookInfo) return <p>Loading...</p>;

  return (
    <Container className="my-4">
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex flex-column flex-md-row gap-4 align-items-start">
            <img
              src={bookInfo.imageLinks?.thumbnail || "/no-pictures.png"}
              alt={bookInfo.title}
              style={{ width: "180px", height: "auto", objectFit: "cover", borderRadius: "8px" }}
            />
            <div style={{ flex: 1, maxWidth: "700px" }}>
              <h3>{bookInfo.title}</h3>
              <p><em>{bookInfo.authors?.join(", ")}</em></p>
              <Card.Text dangerouslySetInnerHTML={{ __html: bookInfo.description }} />
              <p className="text-muted">Added on: {new Date(createdAt).toLocaleDateString()}</p>

              <p>Status: <Badge bg={statusColor(status)}>{formatStatus(status)}</Badge></p>
              <Form.Group>
                <Form.Label>
                  Progress: {progress}%
                  <br />
                  {currentPage}/{totalPages} page
                </Form.Label>
                <Form.Range value={progress} onChange={(e) => handleProgressChange(e.target.value)} />
                <ProgressBar now={progress} className="mb-3" />
              </Form.Group>

              <div className="d-flex gap-3">
                <Button onClick={handleSave} variant="primary">Save</Button>
                <Button onClick={handleDelete} variant="danger">Delete</Button>
              </div>
            </div>
          </div>


          <h4>💬 Reviews</h4>
          {myReview && !isEditing ? (
            <div className="mb-3 p-3 border rounded bg-light">
              <strong>Your Review</strong>
              <p>⭐ {myReview.rating} / 5</p>
              <p>{myReview.comment}</p>
              <Button size="sm" onClick={() => setIsEditing(true)}>Edit</Button>
            </div>
          ) : (
            <Form
              className="mb-4 p-3 border rounded bg-light"
              onSubmit={(e) => {
                e.preventDefault();
                handleReviewSave();
              }}
            >
              <Form.Group className="mb-2">
                <Form.Label>⭐ Rating</Form.Label>
                <StarRating rating={rating} setRating={setRating} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Your Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </Form.Group>
              <Button type="submit" size="sm">
                Save
              </Button>
            </Form>
          )}

          {otherReviews.length > 0 && (
            <div>
              <h6>Other Reviews</h6>
              {otherReviews.map(r => (
                <div key={r.id} className="mb-3 p-2 border rounded">
                  <strong>{r.username}</strong>
                  <p>⭐ {r.rating}</p>
                  <p>{r.comment}</p>
                </div>
              ))}
            </div>
          )}

        </Card.Body>
      </Card>
    </Container>
  );
}

function formatStatus(status) {
  switch (status) {
    case "reading": return "Reading";
    case "completed": return "Completed";
    case "want_to_read": return "Want to Read";
    default: return status;
  }
}

function statusColor(status) {
  switch (status) {
    case "reading": return "primary";
    case "completed": return "success";
    case "want_to_read": return "warning";
    default: return "secondary";
  }
}

export default BookDetailPage;