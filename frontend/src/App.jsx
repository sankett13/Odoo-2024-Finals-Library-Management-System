import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login/login';
import Register from './pages/login/register';
import Home from './pages/home/home';
import ProtectedRoute from './components/protectedRoute';
import AdminProtectedRoute from './components/adminProtectedRoute';
import { AuthProvider } from './components/authProvider';
import SuperAdminProtectedRoute from '../src/components/superUser'; 
import Super from './pages/superUser/super';
import CreateBook from './pages/admin/createBook';
import AdminDashboard from './pages/admin/adminDashboard';
import ShowBooks from './pages/admin/showBooks';
import BookCard from './pages/admin/Bookcard';
import UserProfile from './components/userProfile';
import DeleteBook from './components/delete';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Normal paths */}
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/showBooks" element={<ShowBooks />} />
          <Route path="/displayBook/:id" element={<BookCard />} />
          <Route path="/login" element={<Login />} />

          {/* Protected paths */}
          <Route path='/delete' element={<ProtectedRoute element={DeleteBook} /> }/>



          {/* Admin paths */}
            <Route path="/createBook" element={<AdminProtectedRoute element={CreateBook} />} />
            
            <Route path="/adminDash" element={<AdminProtectedRoute element={AdminDashboard} />} />
            



          {/* Super Admin paths */}
          <Route path="/super" element={<SuperAdminProtectedRoute element={Super} />} />



        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
