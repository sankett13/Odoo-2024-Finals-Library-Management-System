import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for routing
import BookInfoCard from "./BookInfoCard";

const ShowBooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/showBooks")
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4">
      {books.map((book) => (
        <Link key={book._id} to={`/displayBook/${book._id}`}>

          <BookInfoCard
            coverUrl={book.thumbnailUrl}
            title={book.title}
            author={book.author}
            year={book.year}
            preview={book.preview}
            description={book.description}
          />
        </Link>
      ))}
    </div>
  );
};

export default ShowBooks;
