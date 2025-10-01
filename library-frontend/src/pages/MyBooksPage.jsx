import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";
import { Container, Row, Col, Card, ProgressBar, Badge } from "react-bootstrap";
import "./MyBooksPage.css";
const SEARCH_BASE_URL = import.meta.env.VITE_SEARCH_BASE_URL;


function MyBooksPage() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookData, setBookData] = useState([]);

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  useEffect(() => {
    async function fetchMyBooks() {
      try {
        const res = await axios.get(`${BASE_URL}/mybooks`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const userBooks = res.data.books;

        const detailed = await Promise.all(
          userBooks.map(async (b) => {
            const r = await axios.get(`${SEARCH_BASE_URL}/${b.book_id}`);
            return {
              ...b,
              volumeInfo: r.data.volumeInfo
            };
          })
        );

        setBookData(detailed);
      } catch (err) {
        console.error("Fail to bring myBooks:", err);
      }
    }

    if (token) fetchMyBooks();
  }, [token]);

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4 bg-dark bg-gradient bg-opacity-75 text-white">📚 My Books</h2>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {bookData.map(book => {
          const info = book.volumeInfo;
          return (
            <Col key={book.book_id}>
              <Card className="book-card h-100" onClick={() => navigate(`/mybooks/${book.book_id}`)} style={{ cursor: "pointer" }} >
                <Card.Img
                  variant="top"
                  src={info.imageLinks?.thumbnail || "no-pictures.png"}
                  alt={info.title}
                  style={{ height: "250px", objectFit: "fill" }}
                />
                <Card.Body>
                  <Card.Title>{info.title}</Card.Title>
                  <Card.Text>{info.authors?.join(", ") || "no author"}</Card.Text>

                  {/* status badge */}
                  <Badge bg={statusColor(book.status)} className="mb-2">
                    {formatStatus(book.status)}
                  </Badge>

                  {/* progress */}
                  <div className="mb-2">
                    <ProgressBar now={book.progress} label={`${book.progress}%`} />
                  </div>

                  {/* added date */}
                  <Card.Text className="text-muted" style={{ fontSize: "0.75rem" }}>
                    add: {new Date(book.created_at).toLocaleDateString()}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

// status text
function formatStatus(status) {
  switch (status) {
    case "reading":
      return "▶️ Reading";
    case "completed":
      return "✅ Completed";
    case "want_to_read":
      return " Want to read";
  }
}

//  badge style
function statusColor(status) {
  switch (status) {
    case "reading":
      return "primary";
    case "completed":
      return "success";
    case "want_to_read":
      return "warning";
    default:
      return "secondary";
  }
}

export default MyBooksPage;