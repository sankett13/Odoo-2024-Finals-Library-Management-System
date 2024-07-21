import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BookCard = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/displayBook/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch book details');
        }
        const data = await response.json();
        setBook(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching book details:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]); 

  const handelBorrow = async () => {
    try {
      const response = await fetch(`http://localhost:8080/borrow/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials : 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to borrow book');
      }
      const data = await response.json();
      alert(`Book borrowed successfully: ${data.message}`);
    } catch (error) {
      console.error('Error borrowing book:', error);
      alert(`Error borrowing book: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex p-6 bg-white shadow rounded-lg max-w-3xl">
        <div className="w-56 h-80 bg-gray-400 rounded">
          <img src={book.thumbnailUrl} alt="Book Cover" className="w-128 h-158 object-cover rounded" />
        </div>
        <div className="ml-6 flex flex-col justify-between flex-1">
          <div>
            <h2 className="text-2xl font-bold text-[#5D3891]">{book.title}</h2>
            <h3 className="text-xl font-semibold mt-2 text-[#5D3891]">{book.author}</h3>
            <p className="text-sm text-gray-600 mt-4">
              {book.description}
            </p>
          </div>
          <div className="flex justify-end mt-6">
            <button className="bg-[#5D3891] hover:bg-[#F99417] text-white py-2 px-6 rounded" 
              onClick={handelBorrow}
            >
              Borrow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
