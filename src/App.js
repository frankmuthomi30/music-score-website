// src/App.js

import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './component/Home';
import Navbar from './component/Navbar';
import Footer from './component/Footer';
import MusicSheetsPage from './component/MusicSheetsPage';
import UploadPage from './component/UploadPage';
import AboutPage from './component/AboutPage';
import SignOutPage from './component/SignOutPage';
import SignInPage from './component/SignInPage';
import Profile from './component/Profile'; // Import the Profile component
import { AuthProvider } from './AuthContext'; // Import AuthProvider
import ForgotPasswordPage from './component/ForgotPasswordPage';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<MusicSheetsPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signout" element={<SignOutPage />} />
            <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
            <Route path="/profile" element={<Profile />} /> {/* Add the Profile route */}
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
