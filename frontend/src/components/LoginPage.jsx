import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useChat } from "../context/ChatContext"; // adjust path if your context lives elsewhere

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { reloadUser } = useChat(); // server-verified user loader

const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  try {
    const res = await axios.post(
      "http://localhost:8080/api/auth/admin/login",
      { email, password },
      { withCredentials: true }
    );

    console.log('login response status:', res.status);
    console.log('login response data:', res.data);
    console.log('login response headers:', res.headers);

    if (res.status !== 200) {
      setError('Login failed: server returned status ' + res.status);
      return;
    }

    // If backend returns JSON error shape { ok:false, error: '...' }
    if (res.data && res.data.ok === false) {
      setError(res.data.error || 'Login failed');
      return;
    }

    // Wait for reloadUser to fetch server-verified user
    try {
      const user = await reloadUser(); // assume this returns the user or null
      console.log('reloadUser returned:', user);
      if (!user) {
        setError('Login succeeded but server session not available. Check cookies/CORS.');
        return;
      }
    } catch (err) {
      console.error('reloadUser error', err);
      setError('Login succeeded but failed to load session. See console.');
      return;
    }

    // Everything ok — navigate to admin
    navigate("/admin");
  } catch (err) {
    console.error("login error", err);
    if (err.response && err.response.data) {
      console.error('login response data:', err.response.data);
      setError(err.response.data.error || err.response.data.message || JSON.stringify(err.response.data));
    } else {
      setError('Login failed. Check credentials.');
    }
  }
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#800000] p-7">
      <div className="flex flex-col items-center mb-8">
        <img
          src="/wildcare.jpg"
          alt="WildCare Logo"
          className="w-[240px] h-[240px]  object-contain"
          onError={(e) => (e.target.style.display = "none")}
        />
      </div>

      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="text-gray-900 font-medium block">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-900 font-medium block">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Sign In
          </button>
        </form>

        {error && <div className="mt-4 text-center text-red-700">{error}</div>}

        {/* Forgot Password */}
        <div className="mt-6 text-center">
          <a
            href="#"
            className="text-gray-900 underline hover:text-red-700 transition"
          >
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
