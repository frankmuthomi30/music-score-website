import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './component/Navbar';
import Footer from './component/Footer';
import { AuthProvider } from './AuthContext';
import { Loader } from 'lucide-react';

// Lazy load components
const Home = lazy(() => import('./component/Home'));
const MusicSheetsPage = lazy(() => import('./component/MusicSheetsPage'));
const UploadPage = lazy(() => import('./component/UploadPage'));
const AboutPage = lazy(() => import('./component/AboutPage'));
const SignOutPage = lazy(() => import('./component/SignOutPage'));
const SignInPage = lazy(() => import('./component/SignInPage'));
const Profile = lazy(() => import('./component/Profile'));
const ForgotPasswordPage = lazy(() => import('./component/ForgotPasswordPage'));

// Loading component
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <Loader className="animate-spin h-10 w-10 text-blue-500" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<MusicSheetsPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signout" element={<SignOutPage />} />
              <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Suspense>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;