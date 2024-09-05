import React, { useState, useEffect } from 'react';
import { Search, Music, Calendar, User, BookOpen, Download, Eye } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { firestore } from './firebase-config';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const MusicSheetTable = ({ sheets, onPreview }) => (
  <table className="min-w-full bg-white rounded-lg shadow-md">
    <thead>
      <tr className="bg-indigo-600 text-white text-left">
        <th className="py-3 px-6">Title</th>
        <th className="py-3 px-6">Composer</th>
        <th className="py-3 px-6">Category</th>
        <th className="py-3 px-6">Date Uploaded</th>
        <th className="py-3 px-6">Actions</th>
      </tr>
    </thead>
    <tbody>
      {sheets.map((sheet) => (
        <tr key={sheet.id} className="border-b border-indigo-200 hover:bg-indigo-50">
          <td className="py-3 px-6">{sheet.title}</td>
          <td className="py-3 px-6">{sheet.composer}</td>
          <td className="py-3 px-6">{sheet.category}</td>
          <td className="py-3 px-6">{new Date(sheet.timestamp.seconds * 1000).toLocaleDateString()}</td>
          <td className="py-3 px-6 flex space-x-2">
            <button
              onClick={() => onPreview(sheet)}
              className="bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition-colors duration-200 flex items-center"
            >
              <Eye size={16} className="mr-2" /> Preview
            </button>
            <a
              href={sheet.fileUrl}
              download
              className="bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition-colors duration-200 flex items-center"
            >
              <Download size={16} className="mr-2" /> Download
            </a>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="float-right text-gray-600 hover:text-gray-800 text-2xl">&times;</button>
        {children}
      </div>
    </div>
  );
};

const MusicSheetsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [musicSheets, setMusicSheets] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMusicSheets();
  }, []);

  const fetchMusicSheets = async () => {
    setLoading(true);
    try {
      const scoresCollection = collection(firestore, 'scores');
      const q = query(scoresCollection, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const sheets = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMusicSheets(sheets);
    } catch (error) {
      console.error("Error fetching music sheets:", error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setSelectedLetter('');
  };

  const handleLetterSearch = (letter) => {
    setSelectedLetter(letter);
    setSearchTerm('');
  };

  const handlePreview = (sheet) => {
    setSelectedSheet(sheet);
    setIsModalOpen(true);
  };

  const filteredSheets = musicSheets.filter(sheet =>
    (searchTerm === '' || 
     sheet.title.toLowerCase().includes(searchTerm) ||
     sheet.composer.toLowerCase().includes(searchTerm) ||
     sheet.category.toLowerCase().includes(searchTerm)) &&
    (selectedLetter === '' || sheet.title.toLowerCase().startsWith(selectedLetter.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-purple-200 pt-16">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-indigo-800 mb-8 text-center">Kikuyu Music Sheets</h1>

        {/* Alphabet Search */}
        <div className="flex flex-wrap justify-center mb-6 max-w-3xl mx-auto">
          {alphabet.map(letter => (
            <button
              key={letter}
              onClick={() => handleLetterSearch(letter)}
              className={`px-2 py-1 m-1 rounded-full border border-indigo-300 hover:bg-indigo-500 hover:text-white focus:outline-none transition-colors duration-200 ${selectedLetter === letter ? 'bg-indigo-500 text-white' : 'text-indigo-500'}`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search by title, composer, or category..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-4 pl-12 rounded-full border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400" size={20} />
        </div>

        {loading ? (
          <div className="text-center text-indigo-600">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4">Loading music sheets...</p>
          </div>
        ) : (
          <>
            {/* Music Sheets Table */}
            <div className="overflow-x-auto">
              <MusicSheetTable sheets={filteredSheets} onPreview={handlePreview} />
            </div>

            {/* No Results Found */}
            {filteredSheets.length === 0 && (
              <p className="text-center text-indigo-600 mt-8">No music sheets found matching your search.</p>
            )}
          </>
        )}
      </div>

      {/* Preview Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedSheet && (
          <div>
            <h2 className="text-2xl font-bold mb-2 text-indigo-900">{selectedSheet.title}</h2>
            <p className="text-indigo-700 mb-4">Composer: {selectedSheet.composer}</p>
            <div className="mb-4 h-[60vh] w-full">
              <iframe
                src={`${selectedSheet.fileUrl}#view=FitH`}
                title={selectedSheet.title}
                width="100%"
                height="100%"
                frameBorder="0"
              />
            </div>
            <a
              href={selectedSheet.fileUrl}
              download
              className="bg-purple-500 text-white px-6 py-2 rounded-full hover:bg-purple-600 transition-colors duration-200 inline-flex items-center"
            >
              <Download size={16} className="mr-2" /> Download
            </a>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MusicSheetsPage;
