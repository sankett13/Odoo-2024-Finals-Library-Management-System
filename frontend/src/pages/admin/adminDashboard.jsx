import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import Navbar from '../../components/Navbar';
import Deletecard from './deleteCard';

const AdminDashboard = () => {
  const [showAllBooks, setShowAllBooks] = useState(false);
  const [stats, setStats] = useState({
    booksBorrowed: 0,
    availableBooks: 0,
    pendingDues: 0,
    totalUsers: 0,
    totalBooks: 0,
    mostBorrowedBook: { title: "N/A", count: 0 },
    recentBorrows: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8080/admin/stats', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleAddBook = () => {
    navigate('/createBook');
  };

  const handleShowAllBooks = () => {
    navigate('/showBooks');
  };

  const StatCard = ({ title, value }) => (
    <div className="border border-[#E8E2E2] p-4 rounded shadow bg-white">
      <h2 className="font-bold text-sm text-[#5D3891]">{title}</h2>
      <CountUp
        end={value}
        duration={2.5}
        separator=","
        className="text-2xl mt-2 text-[#5D3891]"
      />
    </div>
  );
  const handleDeleteBooks = () =>{
    navigate('/delete')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F5] text-[#333333]">
      <h1 className="text-3xl font-bold text-[#5D3891] mb-6">Admin Dashboard</h1>
      <Navbar/>
      
      <div className="grid grid-cols-3 gap-4 w-full max-w-4xl mx-auto mb-6">
        <StatCard title="Books Borrowed" value={stats.booksBorrowed} />
        <StatCard title="Available Books" value={stats.availableBooks} />
        <StatCard title="Pending Dues" value={stats.pendingDues} />
        <StatCard title="Total Users" value={stats.totalUsers} />
        <StatCard title="Total Books" value={stats.totalBooks} />
        <StatCard title="Recent Borrows (7 days)" value={stats.recentBorrows} />
      </div>

      <div className="border border-[#E8E2E2] p-4 rounded shadow bg-white w-full max-w-4xl mx-auto mb-6">
        <h2 className="font-bold text-sm text-[#5D3891]">Most Borrowed Book</h2>
        <p className="text-xl mt-2 text-[#5D3891]">{stats.mostBorrowedBook.title}</p>
        <p className="text-sm text-[#5D3891]">
          Borrowed <CountUp end={stats.mostBorrowedBook.count} duration={2.5} /> times
        </p>
      </div>

      <div className="flex justify-center space-x-4 mb-6 w-full max-w-4xl mx-auto">
        <button 
          onClick={handleAddBook}
          className="bg-[#5D3891] hover:bg-[#F99417] text-white font-bold py-2 px-4 rounded"
        >
          Add Book
        </button>
        <button 
          onClick={handleShowAllBooks}
          className="bg-[#5D3891] hover:bg-[#F99417] text-white font-bold py-2 px-4 rounded"
        >
          {showAllBooks ? 'Hide Books' : 'Show All Books'}
        </button>
      </div>

      <div className="flex justify-center mb-6">
        <button 
          onClick={handleDeleteBooks}
          className="bg-[#5D3891] hover:bg-[#F99417] text-white font-bold py-2 px-4 rounded"
        >
          Delete Books
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;