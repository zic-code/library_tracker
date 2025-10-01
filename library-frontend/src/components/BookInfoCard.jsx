import { Card, Badge } from "react-bootstrap";

function BookInfoCard({ bookInfo, createdAt, status }) {
  return (
    <div className="d-flex flex-column flex-md-row gap-4 align-items-start">
      <img
        src={bookInfo.imageLinks?.thumbnail || "no-pictures.png"}
        alt={bookInfo.title}
        style={{ width: "180px", height: "auto", objectFit: "cover", borderRadius: "8px" }}
      />
      <div style={{ flex: 1, maxWidth: "700px" }}>
        <h3>{bookInfo.title}</h3>
        <p><em>{bookInfo.authors?.join(", ")}</em></p>
        <Card.Text dangerouslySetInnerHTML={{ __html: bookInfo.description }} />
        <p className="text-muted">Added on: {new Date(createdAt).toLocaleDateString()}</p>
        <p>Status: <Badge bg={statusColor(status)}>{formatStatus(status)}</Badge></p>
      </div>
    </div>
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

export default BookInfoCard;
