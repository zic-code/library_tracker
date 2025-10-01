function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <div>
      <h6>Other Reviews</h6>
      {reviews.map(r => (
        <div key={r.id} className="mb-3 p-2 border rounded">
          <strong>{r.username}</strong>
          <p>⭐ {r.rating}</p>
          <p>{r.comment}</p>
        </div>
      ))}
    </div>
  );
}

export default ReviewList;
