import React from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Download,
  Users,
  Book,
  CloudDownload,
  Heart,
  Smile,
  Coffee,
  GitBranch,
} from 'lucide-react';

const AboutPage = () => {
  const icons = [
    { icon: User, text: 'About the Site' },
    { icon: Download, text: 'Download Scores' },
    { icon: Users, text: 'For Choirs' },
    { icon: Book, text: 'Mass Resources' },
    { icon: CloudDownload, text: 'Accessibility' },
    { icon: Heart, text: 'Our Mission' },
    { icon: Smile, text: 'User Experience' },
    { icon: Coffee, text: 'Inspiration' },
    { icon: GitBranch, text: 'Future Plans' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-16">
      <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-4xl relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 3 }}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-gray-200 via-transparent to-gray-200 rounded-lg z-0"
        ></motion.div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:order-2">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-gray-800 mb-6"
            >
              About Our Platform
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-gray-600 leading-relaxed space-y-4"
            >
              <p>
                Our mission is to bring high-quality, downloadable music scores to Catholic masses and choirs. We believe that music has a profound impact on the worship experience.
              </p>
              <p>
                Explore our resources and join us in enhancing the musical journey of your community.
              </p>
            </motion.div>
          </div>
          <div className="md:order-1 grid grid-cols-3 gap-4">
            {icons.map(({ icon: Icon, text }, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <Icon className="w-10 h-10 text-gray-800 mb-2" />
                <span className="text-gray-800 font-medium">{text}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="relative z-20 mt-10 bg-gradient-to-r from-green-400 to-green-600 p-5 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold text-center text-white mb-4">
            Support This Project
          </h2>
          <p className="text-white text-center mb-2">
            If you'd like to support our mission, you can contribute through M-Pesa.
          </p>
          <p className="text-center text-lg text-blue-50 font-semibold">
            M-Pesa Number: <span className="font-bold">0797 887 378</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
