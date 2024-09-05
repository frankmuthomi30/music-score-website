import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase-config'; // Adjust import based on your setup
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory

const SignOutPage = () => {
  const navigate = useNavigate(); // Use useNavigate hook

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/SignInPage'); // Redirect to sign-in page after sign-out
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-300">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Signed Out</h2>
        <p className="mb-4 text-gray-900">You have been successfully signed out.</p>
        <button
          onClick={handleSignOut}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Go to Sign-In
        </button>
      </div>
    </div>
  );
};

export default SignOutPage;
