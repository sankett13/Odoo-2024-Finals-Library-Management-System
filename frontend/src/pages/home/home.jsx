import React, { useState, useEffect } from "react";
import { useAuth } from "../../components/authProvider";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import SearchBarWithFilters from "../../components/search";
import NewArrivals from "./NewArrivals";
import Trending from "./Trending";
import SearchResult from "../../components/searchResult"; // Assuming SearchResult component handles displaying search results

const Home = () => {
  const { setAuth } = useAuth();
  const [newArrivals, setNewArrivals] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await fetch("http://localhost:8080/showBooks");
        if (response.ok) {
          const data = await response.json();
          setNewArrivals(data);
        } else {
          console.error("Failed to fetch new arrivals:", response.statusText);
        }
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error.message);
      }
    };

    fetchNewArrivals();
  }, []);

  // Function to handle search
  const handleSearch = async (query) => {
    setSearchQuery(query);
    try {
      const response = await fetch("http://localhost:8080/queryBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.error("Failed to fetch search results:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to fetch search results:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="text-center mt-24 mb-8">
        <h1 className="text-3xl font-bold text-white">
          Search the books available in Library
        </h1>
      </div>
      <SearchBarWithFilters onSearch={handleSearch} />
      {searchQuery === "" ? (
        <div className="flex flex-col md:flex-row justify-center md:justify-between px-8 mt-8">
          <div className="w-full md:w-1/2 mb-4 md:mb-0 md:mr-4 rounded-lg p-4">
            <NewArrivals newArrivals={newArrivals} />
          </div>
          <div className="w-full md:w-1/2 rounded-lg p-4">
            <Trending trendingBooks={newArrivals} />
          </div>
        </div>
      ) : (
        <div className="flex justify-center px-8 mt-8">
          <div className="w-full md:w-1/2 rounded-lg p-4">
            <SearchResult results={searchResults} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;