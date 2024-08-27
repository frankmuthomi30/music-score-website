// src/component/ForgotPasswordPage.js

import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase-config'; // Adjust import based on your setup
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Circles } from 'react-loader-spinner'; // Import a loader spinner

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate(); // Initialize useNavigate

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when password reset starts
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset email sent successfully.');
      setTimeout(() => navigate('/signin'), 3000); // Redirect to sign-in after 3 seconds
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // Set loading to false when password reset completes
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="bg-blue-200 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-bold text-blue-800 mb-4">Forgot Password</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}
        <form onSubmit={handlePasswordReset}>
          <div className="mb-4">
            <label className="block text-blue-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            disabled={loading} // Disable button while loading
          >
            Send Password Reset Email
          </button>
        </form>
        {loading && (
          <div className="flex justify-center mt-4">
            <Circles color="#00BFFF" height={50} width={50} /> {/* Loader spinner */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
