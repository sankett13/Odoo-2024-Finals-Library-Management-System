import React from "react";
import { Link } from "react-router-dom";
import BookInfoCard from "../admin/BookInfoCard";

const NewArrivals = ({ newArrivals }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">
        New Arrivals
      </h2>
      <div className="grid grid-cols-1 gap-4 justify-items-center">
        {newArrivals.map((book) => (
          <div key={book._id} className="w-full">
            <Link to={`/displayBook/${book._id}`}>
              <BookInfoCard
                coverUrl={book.thumbnailUrl}
                title={book.title}
                author={book.author}
                year={book.year}
                preview={book.preview}
                description={book.description}
              />
            </Link>
        
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewArrivals;
