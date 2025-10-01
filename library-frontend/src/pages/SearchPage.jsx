// src/pages/SearchPage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
const SEARCH_BASE_URL = import.meta.env.VITE_SEARCH_BASE_URL;


function SearchPage() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const q = searchParams.get("query");
    if (q) {
      setQuery(q);
      searchBooks(q);
    }
  }, [searchParams])

  async function searchBooks(keyword) {
    try {
      const res = await axios.get(SEARCH_BASE_URL, {
        params: {
          q: keyword,
          maxResults: 12,
        }
      });
      const resultBooks = res.data.items || [];
      setBooks(resultBooks);
      setError(null);
    } catch (err) {
      console.error("Error while Searching", err);
      setError("Error while Searching")
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      setSearchParams({ query });
      await searchBooks(query); 
    } catch (err) {
      console.error("error while searching", err
      )
      setError("Error while searching");
    }
  };

  const handleBookClick = (bookId) => {
    navigate(`/books/${bookId}`, {
      state: {
        fromSearch: true,
        searchQuery: query,
      },
    });
  };

  return (
    <Container className="my-4 ">
      <h1 className="mb-3 bg-dark text-light">🔎 Search the book</h1>

      <Form onSubmit={handleSearch} className="mb-4">
        <Form.Group controlId="searchQuery">
          <Form.Control
            type="text"
            placeholder="Search by Title or Keyword"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" className="mt-2">
          Search
        </Button>
      </Form>

      {error && <p className="text-danger">{error}</p>}

      <Row>
        {books.map((book) => {
          const info = book.volumeInfo;
          return (
            <Col key={book.id} xs={12} md={6} lg={4} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={info.imageLinks?.thumbnail || "/no-pictures.png"}
                  alt={info.title}
                />
                <Card.Body>
                  <Card.Title>{info.title}</Card.Title>
                  <Card.Text>{info.authors?.join(", ")}</Card.Text>
                  <Button onClick={() => handleBookClick(book.id)} className="btn btn-primary btn-sm">
                    Detail
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export default SearchPage;
