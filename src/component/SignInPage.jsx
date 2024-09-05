import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase-config'; // Adjust import based on your setup
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Circles } from 'react-loader-spinner'; // Import a loader spinner

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20" className="mr-2">
    <path fill="#4285F4" d="M24 9.5c3.9 0 7.1 1.3 9.5 3.9l6.8-6.8C36.7 2.9 30.8 0 24 0 14.5 0 6.5 5.8 2.4 14.1l7.7 6C12.3 13 17.6 9.5 24 9.5z"/>
    <path fill="#34A853" d="M46.5 24.5c0-1.7-.1-2.9-.3-4.3H24v8.1h12.7c-0.5 3-2.5 6.3-5.6 8.3l7.7 6C43 38.5 46.5 32 46.5 24.5z"/>
    <path fill="#FBBC05" d="M12.3 29.8c-1-3-1.5-6.2-1.5-9.5s0.5-6.5 1.5-9.5L2.4 5.9C0.8 9.1 0 12.9 0 16.8c0 3.9 0.8 7.7 2.4 10.9l7.7-6z"/>
    <path fill="#EA4335" d="M24 48c6.5 0 11.9-2.1 15.8-5.7l-7.7-6c-2.1 1.4-4.8 2.3-8.1 2.3-6.4 0-11.8-4.3-13.8-10.2l-7.7 6C6.5 42.2 14.5 48 24 48z"/>
  </svg>
);

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/profile'); // Redirect to profile page
    } catch (error) {
      console.log(error); // Log full error for debugging
      if (error.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (error.code === 'auth/user-not-found') {
        setError('No user found with this email.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false); // Set loading to false after completion
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/profile'); // Redirect to profile page upon successful sign-in
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-slate-300">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-bold text-blue-800 mb-4">Sign In</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSignIn}>
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
          <div className="mb-4">
            <label className="block text-blue-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            disabled={loading} // Disable button while loading
          >
            Sign In
          </button>
        </form>
        <button
          onClick={handleGoogleSignIn}
          className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center transition duration-300"
        >
          <GoogleIcon />
          Sign In with Google
        </button>
        {loading && (
          <div className="flex justify-center mt-4">
            <Circles color="#00BFFF" height={50} width={50} /> {/* Loader spinner */}
          </div>
        )}
        <p className="mt-4 text-blue-600">
          <a href="/forgotpassword" className="hover:underline">Forgot your password?</a>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
