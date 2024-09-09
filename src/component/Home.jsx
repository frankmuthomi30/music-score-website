import React, { useEffect, useState } from 'react';
import { Music, Upload, Download, Search, Users, Eye } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { auth, firestore } from './firebase-config';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import Carousel from './Carousel';

// Import images
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

const MusicSheet = ({ title, composer, fileUrl, onClick }) => (
  <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300">
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-600 mb-4">Composed by: {composer}</p>
    <div className="flex justify-between items-center">
      <button 
        onClick={onClick}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 flex items-center"
      >
        <Eye className="mr-2" size={16} /> Preview
      </button>
      <a 
        href={fileUrl} 
        download 
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300 flex items-center"
      >
        <Download className="mr-2" size={16} /> Download
      </a>
    </div>
  </div>
);

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="float-right text-gray-600 hover:text-gray-800">&times;</button>
        {children}
      </div>
    </div>
  );
};

const Home = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ userCount: 0, scoreCount: 0 });
  const [latestScores, setLatestScores] = useState([]);
  const [selectedScore, setSelectedScore] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnapshot = await getDocs(collection(firestore, 'users'));
        const scoresSnapshot = await getDocs(collection(firestore, 'scores'));
        setStats({
          userCount: usersSnapshot.size,
          scoreCount: scoresSnapshot.size,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    const fetchLatestScores = async () => {
      try {
        const scoresQuery = query(collection(firestore, 'scores'), orderBy('timestamp', 'desc'), limit(5));
        const querySnapshot = await getDocs(scoresQuery);
        const scoresData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLatestScores(scoresData);
      } catch (error) {
        console.error('Error fetching latest scores:', error);
      }
    };

    fetchStats();
    fetchLatestScores();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleScoreClick = (score) => {
    setSelectedScore(score);
    setIsModalOpen(true);
  };

  const features = [
    { icon: Upload, title: "Upload Sheets", description: "Share your Kikuyu music compositions" },
    { icon: Download, title: "Download Sheets", description: "Access a wide variety of Kikuyu music" },
    { icon: Search, title: "Search Collection", description: "Find specific songs or composers" },
    { icon: Users, title: "Contribute", description: "Join our community of music enthusiasts" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-300 flex flex-col">
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
          <p className="text-xl md:text-lg text-blue-700">
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

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {features.map((item, index) => (
            <FeatureCard key={index} {...item} index={index} />
          ))}
        </section>

        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Latest Scores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestScores.map(score => (
              <MusicSheet
                key={score.id}
                title={score.title}
                composer={score.composer}
                fileUrl={score.fileUrl}
                onClick={() => handleScoreClick(score)}
              />
            ))}
          </div>
        </motion.section>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedScore && (
          <div>
            <h2 className="text-2xl font-bold mb-2">{selectedScore.title}</h2>
            <p className="text-gray-600 mb-4">Composer: {selectedScore.composer}</p>
            <div className="mb-4 h-[60vh] w-full">
              <iframe
                src={`${selectedScore.fileUrl}#view=FitH`}
                title={selectedScore.title}
                width="100%"
                height="100%"
                frameBorder="0"
              />
            </div>
            <a
              href={selectedScore.fileUrl}
              download
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300 inline-block"
            >
              Download
            </a>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Home;
