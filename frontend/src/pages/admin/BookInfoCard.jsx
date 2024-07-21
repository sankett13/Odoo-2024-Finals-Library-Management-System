import React from 'react';

const BookInfoCard = ({ coverUrl, title, author, year, preview, description }) => {
  return (
    <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-md max-w-full mb-4">
      <img 
        src={coverUrl || 'https://via.placeholder.com/128x192.png?text=No+Cover'} 
        alt={`Cover of ${title}`} 
        className="w-128  h-158 object-cover rounded-md shadow-sm"
      />
      <div className="flex-1">
        <h2 className="text-xl font-bold text-blue-600">{title}</h2>
        <p className="text-gray-600">
          {author} · {year} · {preview}
        </p>
        <p className="mt-2 text-gray-800 text-sm line-clamp-3">
          {description}
        </p>
      </div>
      
    </div>
  );
};

export default BookInfoCard;
