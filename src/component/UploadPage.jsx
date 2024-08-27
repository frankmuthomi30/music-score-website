import React, { useState } from 'react';
import { Upload as UploadIcon, Music, User, Calendar, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
  'Kuingira (entrance)',
  'Mass (MITHA)',
  'Mathomo (readings)',
  'Thaburi (Psalms)',
  'Matega (sadaka)',
  'Wamukiri (communion)',
  'Gucokia ngatho (thanksgiving)',
  'Kurikia Mitha (EXIT SONG)',
  'Nyimbo cia maria (marian songs)',
  'Ngunurano (ordination songs)',
  'Nyimboo cia macindano (Set pieces)',
  'Itiia (Eucharist Adoration songs)',
];

const Card = ({ children }) => (
  <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <h1 className="text-3xl font-extrabold text-blue-800 mb-6 text-center">
    {children}
  </h1>
);

const CardContent = ({ children }) => (
  <div>{children}</div>
);

const UploadPage = () => {
  const [name, setName] = useState('');
  const [composer, setComposer] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setProgress(0);
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      // Simulating file upload progress
      for (let i = 0; i <= 100; i++) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        setProgress(i);
      }

      console.log('Name:', name);
      console.log('Composer:', composer);
      console.log('Category:', category);
      console.log('File:', file);

      // Add your actual upload logic here
    } catch (err) {
      setError(err.message);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex flex-col justify-center items-center">
      <Card>
        <CardHeader>Upload Music Sheet</CardHeader>
        <CardContent>
          <div className="mb-4">
            <label htmlFor="name" className="block text-blue-700 font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="composer" className="block text-blue-700 font-medium mb-2">
              Composer
            </label>
            <input
              type="text"
              id="composer"
              value={composer}
              onChange={(e) => setComposer(e.target.value)}
              className="w-full p-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-blue-700 font-medium mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value="">Select a category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="file" className="block text-blue-700 font-medium mb-2">
              Music Sheet
            </label>
            <div className="relative">
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                className="w-full p-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
              <AnimatePresence>
                {progress > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-80 flex items-center justify-center"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500 animate-spin mr-2"></div>
                      <span className="font-medium text-blue-700">Uploading... {progress}%</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          {error && (
            <div className="mb-4 bg-red-100 text-red-700 px-4 py-2 rounded-lg flex items-center">
              <AlertCircle className="mr-2" />
              {error}
            </div>
          )}
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-full"
          >
            <UploadIcon className="mr-2" /> Upload
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;