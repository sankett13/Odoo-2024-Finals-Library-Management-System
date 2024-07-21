import React from "react";
import BookInfoCard from "../pages/admin/BookInfoCard";

const SearchResult = ({ results }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">
        Search Results
      </h2>
      <div className="grid grid-cols-1 gap-4 justify-items-center">
        {results.map((book) => (
          <div key={book.id} className="w-full">
            <BookInfoCard
              coverUrl={book.smallThumbnail}
              title={book.title}
              author={book.author}
              year={book.year}
              preview={book.preview}
              description={book.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResult;
