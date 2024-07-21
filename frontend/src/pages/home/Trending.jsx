import React from "react";
import BookInfoCard from "../admin/BookInfoCard";

const Trending = ({ trendingBooks }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">
        Trending
      </h2>
      <div className="grid grid-cols-1 gap-4 justify-items-center">
        {trendingBooks.map((book) => (
          <div key={book.id} className="w-full">
            <BookInfoCard
              coverUrl={book.thumbnailUrl}
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

export default Trending;
