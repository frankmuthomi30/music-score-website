import React, { useEffect, useState } from 'react';
import { Music, Upload, Download, Search, Users, Headphones, Star, TrendingUp } from 'lucide-react';
import Carousel from './Carousel';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { auth } from './firebase-config'; // Import your Firebase configuration
import { signOut } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';

// Import images (adjusted paths)
import choirImage from './images/mass.jpg';
import instrumentsImage from './images/piano.jpg';
import sheetMusicImage from './images/cathedral.jpg';
import choirImage2 from './images/youths.jpg';
import choirImage3 from './images/cathedral.jpg';

const carouselImages = [
  {
    url: choirImage,
    alt: 'Kikuyu choir singing',
    title: 'Vibrant Kikuyu Choirs',
    description: 'Experience the energy of Kikuyu Catholic choirs'
  },
  {
    url: instrumentsImage,
    alt: 'Modern instruments',
    title: 'Modern Instruments',
    description: 'Discover the Use of Latest Modern equipment'
  },
  {
    url: sheetMusicImage,
    alt: 'Sheet music collection',
    title: 'Extensive Sheet Collection',
    description: 'Access a wide variety of Kikuyu Catholic music sheets'
  },
  {
    url: choirImage2,
    alt: 'Kikuyu youth choir singing during a mass service',
    title: 'Youth Kikuyu Choirs',
    description: 'Feel the vibrant and youthful spirit of Catholic youth choirs during mass services.'
  },
  {
    url: choirImage3,
    alt: 'Kikuyu choir singing at a church event',
    title: 'Vibrant Kikuyu Choirs',
    description: 'Experience the energy and harmony of Kikuyu Catholic choirs at special church events.'
  },
];

const FeatureCard = ({ icon: Icon, title, description, index }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0, transition: { delay: index * 0.2 } },
        hidden: { opacity: 0, y: 50 }
      }}
      className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105"
    >
      <Icon className="mx-auto text-blue-600 mb-4" size={48} />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const MusicSheet = ({ title, type, icon: Icon }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-white p-4 rounded shadow flex items-center cursor-pointer"
  >
    <Icon className="text-blue-600 mr-3" size={24} />
    <div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{type}</p>
    </div>
  </motion.div>
);

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const features = [
    { icon: Upload, title: "Upload Sheets", description: "Share your Kikuyu music compositions" },
    { icon: Download, title: "Download Sheets", description: "Access a wide variety of Kikuyu music" },
    { icon: Search, title: "Search Collection", description: "Find specific songs or composers" },
    { icon: Users, title: "Contribute", description: "Join our community of music enthusiasts" }
  ];

  const featuredSheets = [
    { title: "Mūthirigu", type: "Traditional", icon: Music },
    { title: "Kīmuru", type: "Contemporary", icon: Headphones },
    { title: "Mūmbūro", type: "Classical", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.section 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Carousel items={carouselImages} />
        </motion.section>

        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mb-12"
        >
          {user ? (
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Welcome Back, {user.displayName || 'User'}!
            </h2>
          ) : (
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Preserve and Share Kikuyu Catholic Music Scores For Liturgy.
            </h2>
          )}
          <p className="text-lg md:text-xl text-blue-700">
            Discover, upload, and download authentic Kikuyu Catholic music sheets.
          </p>
          {!user ? (
            <div className="mt-4">
              <a href="/signin" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
                Sign In
              </a>
            </div>
          ) : (
            <button 
              onClick={handleSignOut}
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 mt-4"
            >
              Sign Out
            </button>
          )}
        </motion.section>
       
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, index) => (
            <FeatureCard key={index} {...item} index={index} />
          ))}
        </section>
       
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-12 bg-blue-50 rounded-lg p-8"
        >
          <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
            <TrendingUp className="mr-2" /> Featured Sheet Music
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredSheets.map((sheet, index) => (
              <MusicSheet key={index} {...sheet} />
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Home;
