import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Usercard from "../components/userCard";
import SearchBarWithFilters from "../components/search";
import BookInfoCard from "../pages/admin/BookInfoCard";

const UserProfile = () => {
  const [books, setBooks] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchBooks();
    fetchUserInfo();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost:8080/showBooks");
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("http://localhost:8080/userInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include' // Ensures cookies are sent cross-origin
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user info");
      }
      const data = await response.json();
      setUsername(data.username);
      setEmail(data.email);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex p-4 mt-24">
        <div className="flex-1 p-4 rounded-lg">
          <SearchBarWithFilters />
          <h1 className="text-[30px] text-white mt-16 text-center">
            <b>My Books</b>
          </h1>
          {books.map((book) => (
            <BookInfoCard
              key={book.id}
              coverUrl={book.thumbnailUrl}
              title={book.title}
              author={book.author}
              year={book.year}
              preview={book.preview}
              description={book.description}
            />
          ))}
        </div>
        <div
          className="ml-4 h-auto p-4 rounded-lg justify-content-center"
          style={{ maxWidth: "calc(100% - 320px)" }}
        >
          <Usercard username={username} email={email} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
