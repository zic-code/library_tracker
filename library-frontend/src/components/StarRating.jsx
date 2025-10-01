// components/StarRating.jsx
import React from "react";
import { FaStar } from "react-icons/fa";

function StarRating({ rating, setRating }) {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={24}
          color={star <= rating ? "#d4ac0d " : "#717d7e"}
          onClick={setRating ? () => setRating(star) : undefined}
          style={{
            marginRight: 5,
            cursor: setRating ? "pointer" : "default"
          }}
        />
      ))}
    </div>
  );
}

export default StarRating;
