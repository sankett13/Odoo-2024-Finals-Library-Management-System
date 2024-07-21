import React, { useState } from "react";

const SearchBarWithFilters = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("title");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-8 space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:mx-0 mx-4">
      <select
        className="border border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-900 w-full md:w-auto"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="title">Title</option>
        <option value="author">Author</option>
        <option value="year">Year</option>
        <option value="genre">Genre</option>
      </select>

      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for books..."
        className="border border-gray-400 rounded-lg px-4 py-2 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <button
        onClick={handleSearch}
        className="bg-[#5D3891] text-white rounded-lg px-4 py-2 w-auto md:w-auto hover:bg-[#F99417]"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBarWithFilters;