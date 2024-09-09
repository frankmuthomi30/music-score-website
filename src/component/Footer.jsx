import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, Music } from 'lucide-react';
import footerBackground from './images/foot.jpg';  // Import the local image

const FooterLink = ({ to, children }) => (
  <Link to={to} className="text-gray-300 hover:text-white transition-colors duration-300">
    {children}
  </Link>
);

const SocialLink = ({ href, icon: Icon }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300">
    <Icon size={24} />
  </a>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black text-white py-16 mt-auto overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${footerBackground})`,
          filter: "brightness(0.3)"
        }}
      ></div>
     
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80"></div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Music size={36} className="text-blue-500" />
              <h2 className="text-3xl font-bold text-white">Kikuyu Music Sheets</h2>
            </div>
            <p className="text-sm text-gray-300">Preserving and sharing Kikuyu Catholic musical notes with passion and precision.</p>
            <div className="flex space-x-4 mt-4">
              <SocialLink href="#" icon={Facebook} />
              <SocialLink href="#" icon={Twitter} />
              <SocialLink href="#" icon={Instagram} />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white border-b border-blue-500 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li><FooterLink to="/">Home</FooterLink></li>
              <li><FooterLink to="/upload">Upload Sheet</FooterLink></li>
              <li><FooterLink to="/browse">Search Sheets</FooterLink></li>
              <li><FooterLink to="/about">About Us</FooterLink></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white border-b border-blue-500 pb-2">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="mr-2 text-blue-500" size={18} />
                <a href="mailto:frankmuthomi30@gmail.com" className="hover:underline text-gray-300">frankmuthomi30@gmail.com</a>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 text-blue-500" size={18} />
                <a href="tel:+254797887378" className="hover:underline text-gray-300">+254 797 887 378</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400">Powered by Firebase Technologies</p>
          <p className="text-sm text-gray-400 mt-2">&copy; {currentYear} Kikuyu Music Sheets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;