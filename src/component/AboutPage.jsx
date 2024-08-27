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
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex flex-col items-center justify-center py-16">
      <div className="bg-white shadow-xl rounded-lg p-10 w-full max-w-5xl relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 3 }}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-200 via-transparent to-purple-200 rounded-lg z-0"
        ></motion.div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:order-2">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl font-bold text-blue-900 mb-6"
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
                Our mission is to bring high-quality, downloadable music scores to Catholic masses and choirs. We believe that music has a profound impact on worship and community, and we’re here to support those who create and perform it.
              </p>
              <p>
                From a variety of scores to an intuitive interface, we strive to be the one-stop resource for all liturgical music needs. Our platform is designed for choir directors, organists, and music lovers alike.
              </p>
              <p>
                Accessibility is key to our mission. We aim to make music scores available worldwide, regardless of location or financial constraints. Through seamless search and download features, we make sure you get the music you need.
              </p>
              <p>
                Join us as we expand our music library and incorporate new technologies to enhance your experience. We’re always innovating to serve our users better!
              </p>
            </motion.div>
          </div>
          <div className="md:order-1 grid grid-cols-3 gap-6">
            {icons.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md"
              >
                <item.icon className="w-12 h-12 text-blue-600" />
                <span className="text-blue-800 text-md font-semibold">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
