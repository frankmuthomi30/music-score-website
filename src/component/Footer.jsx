import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

const FooterLink = ({ to, children }) => (
  <Link to={to} className="text-white hover:text-white transition-colors duration-300">
    {children}
  </Link>
);

const SocialLink = ({ href, icon: Icon }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-white hover:text-white transition-colors duration-300">
    <Icon size={24} />
  </a>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-purple-700 to-blue-600 text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">Kikuyu Music Sheets</h2>
            <p className="text-sm text-white">Preserving and sharing Kikuyu Catholic musical notes with passion and precision.</p>
            <div className="flex space-x-4">
              <SocialLink href="https://facebook.com" icon={Facebook} />
              <SocialLink href="https://twitter.com" icon={Twitter} />
              <SocialLink href="https://instagram.com" icon={Instagram} />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><FooterLink to="/">Home</FooterLink></li>
              <li><FooterLink to="/about">About Us</FooterLink></li>
              <li><FooterLink to="/upload">Upload Sheet</FooterLink></li>
              <li><FooterLink to="/browse">Search Sheets</FooterLink></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="mr-2 text-white" size={18} />
                <a href="mailto:frankmuthomi30@gmail.com" className="hover:underline text-white">frankmuthomi30@gmail.com</a>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 text-white" size={18} />
                <a href="tel:+254797887378" className="hover:underline text-white">+254 797 887 378</a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Subscribe</h3>
            <p className="text-sm text-white">Stay updated with the latest music sheets and news. Subscribe to our newsletter.</p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="p-2 rounded-md border border-blue-700 bg-blue-800 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="p-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white text-center">
          <p className="text-white">Powered by Firebase Technologies.</p>
          <p className="text-sm text-white">&copy; {currentYear} Kikuyu Music Sheets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
