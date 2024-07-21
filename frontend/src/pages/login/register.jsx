import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        alert('Registration successful. Please login again.');
        navigate('/login');
      } else {
        const errorData = await response.json();
        alert('Registration failed: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F5F5]">
      <div className="bg-white border-2 border-[#5D3891] rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-[#5D3891] mb-6">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[#5D3891] mb-2" htmlFor="username">Username</label>
            <input
              className="w-full p-2 bg-white border border-[#5D3891] rounded text-[#5D3891] focus:outline-none focus:border-[#F99417]"
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#5D3891] mb-2" htmlFor="email">Email</label>
            <input
              className="w-full p-2 bg-white border border-[#5D3891] rounded text-[#5D3891] focus:outline-none focus:border-[#F99417]"
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-[#5D3891] mb-2" htmlFor="password">Password</label>
            <input
              className="w-full p-2 bg-white border border-[#5D3891] rounded text-[#5D3891] focus:outline-none focus:border-[#F99417]"
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>
          <button
            className="w-full py-2 bg-[#5D3891] text-white rounded hover:bg-[#F99417] transition duration-200"
            type="submit"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-[#5D3891]">
          Already have an account? <Link to="/login" className="text-[#F99417]">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;