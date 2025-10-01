import { Form, Button } from "react-bootstrap";
import StarRating from "./StarRating";

function ReviewForm({ rating, setRating, comment, setComment, onSave }) {
  return (
    <Form
      className="mb-4 p-3 border rounded bg-light"
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
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
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Form.Group>
      <Button type="submit" size="sm">
        Save
      </Button>
    </Form>
  );
}

export default ReviewForm;
