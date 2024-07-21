import React, { useState } from "react";

const CreateBook = () => {
  const [isbn, setIsbn] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newBook = { isbn };

    try {
      const response = await fetch("http://localhost:8080/createBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      });
      // Handle response as needed
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-[#5D3891] text-center">Add a New Book</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              ISBN:
            </label>
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#5D3891] hover:bg-[#F99417] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBook;