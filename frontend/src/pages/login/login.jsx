import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../components/authProvider";
import GoogleBtn from "../../components/GoogleAuth";

const Login = () => {
  const { setAuth } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      const result = await response.json();
      if (result.user && result.user.isadmin) {
        setAuth({
          isAuthenticated: true,
          user: result.user,
          isadmin: result.user.isadmin,
          superUser: result.superUser,
        });
        navigate("/adminDash");
      } else if (result.user && result.user.superUser) {
        setAuth({
          isAuthenticated: true,
          user: result.user,
          isadmin: result.user.isadmin,
          superUser: result.user.superUser,
        });
        navigate("/super");
      } else if (result.user) {
        setAuth({
          isAuthenticated: true,
          user: result.user,
          isadmin: result.user.isadmin,
          superUser: result.superUser,
        });
        navigate("/");
      } else {
        console.log("Login failed:", result.message || "Unexpected response");
      }
    } catch (error) {
      console.error("Internal server error in the login component:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F5F5]">
      <div className="bg-white border-2 border-[#5D3891] rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-[#5D3891] mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[#5D3891] mb-2" htmlFor="username">
              Username
            </label>
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
          <div className="mb-6">
            <label className="block text-[#5D3891] mb-2" htmlFor="password">
              Password
            </label>
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
            Login
          </button>
        </form>
        <div className="ml-20 mt-4 mb-4">
          <GoogleBtn />
        </div>
        <p className="mt-4 text-[#5D3891]">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#F99417]">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
