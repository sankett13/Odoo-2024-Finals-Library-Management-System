import React, { useState } from "react";

const DeleteBook = () => {
  const [bookId, setBookId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/deleteBook/${bookId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Book deleted successfully:", result);
      } else {
        console.error("Failed to delete book");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5]">
      <div className="bg-[#E8E2E2] p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center text-[#5D3891]">Delete a Book</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Book ID:
            </label>
            <input
              type="text"
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5D3891]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#5D3891] hover:bg-[#F99417] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Delete Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeleteBook;