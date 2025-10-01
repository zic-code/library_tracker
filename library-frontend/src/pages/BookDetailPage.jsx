// src/pages/BookDetailPage.jsx
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import BASE_URL from "../config";
import {
  Container,
  Card,
  Button,
  Alert,
} from "react-bootstrap";
import StarRating from "../components/StarRating";
const SEARCH_BASE_URL = import.meta.env.VITE_SEARCH_BASE_URL;


function BookDetailPage() {
  const { book_id } = useParams();
  const { token, username } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const searchQuery = location.state?.searchQuery;

  const [bookInfo, setBookInfo] = useState(null);
  const progress = 0;
  const status = "want to read";


  const [myReview, setMyReview] = useState(null);
  const [otherReviews, setOtherReviews] = useState([]);
  const [error, setError] = useState(null);

  const goToMyBookDetail = () => {
    navigate(`/mybooks/${book_id}`)
  }

  const handleBack = () => {
    if (searchQuery) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(-1);
    }
  };
  useEffect(() => {
    if (!token) return navigate("/login");
    if (!username) return;

    fetchBookDetails();
    fetchAllReviews();
  }, [book_id, username]);

  async function fetchBookDetails() {
    try {
      const res = await axios.get(
        `${SEARCH_BASE_URL}/${book_id}`
      );
      setBookInfo(res.data.volumeInfo);
    } catch (err) {
      console.error("fail to fetch the detail of the book", err)
      setError("fail to fetch the detail of the book");
    }
  }

  async function handleSaveToMyBooks() {
    try {
      await axios.post(
        `${BASE_URL}/mybooks/${book_id}`,
        {
          status: status,
          progress: progress,     // default :0
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      navigate("/mybooks");
    } catch (err) {
      console.error("Fail to save", err);
      setError("Fail to save");
    }
  }

  async function fetchAllReviews() {
    try {
      const res = await axios.get(`${BASE_URL}/reviews/${book_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const all = res.data.reviews || [];
      const mine = all.find((r) => r.username === username);
      const others = all.filter((r) => r.username !== username);
      setMyReview(mine);
      setOtherReviews(others);
    } catch (err) {
      console.error("Fail to fetch reviews", err)
      setError("Fail to bring the progress");
    }
  }

  if (!bookInfo) return <p>Loading...</p>;
  return (
    <Container className="my-4 me-3 bg-light" >
      {error && <Alert variant="danger">{error}</Alert>}

      <h2 className="text-center">{bookInfo.title}</h2>
      <p className="text-center text-muted">{bookInfo.authors?.join(", ")}</p>

      <div className="d-flex justify-content-center mb-3">
        <img
          src={bookInfo.imageLinks?.thumbnail || "/no-pictures.png"}
          alt={bookInfo.title}
          style={{ width: "140px" }}
        />
      </div>

      <div
        className="mb-4"
        dangerouslySetInnerHTML={{ __html: bookInfo.description }}
      ></div>

      <p className="text-muted text-center">Published Date: {bookInfo.publishedDate || "Unknown"}</p>

      <Button onClick={handleSaveToMyBooks} className="mb-3">
        📚 Save in to my books
      </Button>

      <div className="text-center mb-4">


      </div>
      <h4 className="text-center">💬 Reviews</h4>
      {myReview && (
        <div className="mb-3">
          <h6 className="fw-bold">My review:</h6>
          <StarRating rating={myReview.rating} />
          <Button onClick={goToMyBookDetail}>go to my Review</Button>
          <p className="mt-2">{myReview.comment}</p>

        </div>
      )}
      {otherReviews.length > 0 && (
        <div>
          <h5>Reviews</h5>
          {otherReviews.map((r) => (
            <Card key={r.id} className="mb-2">
              <Card.Body>
                <strong>User: {r.username}</strong>
                <div className="mt-2 mb-1">
                  <StarRating rating={r.rating} />
                  <span className="ms-2">{r.rating}</span>
                </div>
                <p>{r.comment}</p>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
      <Button onClick={handleBack}> Back to Search</Button>
    </Container>

  );
}

export default BookDetailPage;