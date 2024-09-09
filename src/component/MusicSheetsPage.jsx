import React, { useState, useEffect } from 'react';
import { Search, Music, Calendar, User, BookOpen, Download, Eye, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { firestore } from './firebase-config';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const MusicSheetCard = ({ sheet, onPreview }) => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-4">
    <h3 className="text-lg font-semibold text-indigo-800 mb-2">{sheet.title}</h3>
    <p className="text-sm text-gray-600 mb-1">Composer: {sheet.composer}</p>
    <p className="text-sm text-gray-600 mb-1">Category: {sheet.category}</p>
    <p className="text-sm text-gray-600 mb-3">Date: {new Date(sheet.timestamp.seconds * 1000).toLocaleDateString()}</p>
    <div className="flex space-x-2">
      <button
        onClick={() => onPreview(sheet)}
        className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm hover:bg-indigo-600 transition-colors duration-200 flex items-center"
      >
        <Eye size={14} className="mr-1" /> Preview
      </button>
      <a
        href={sheet.fileUrl}
        download
        className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm hover:bg-purple-600 transition-colors duration-200 flex items-center"
      >
        <Download size={14} className="mr-1" /> Download
      </a>
    </div>
  </div>
);

const MusicSheetTable = ({ sheets, onPreview, sortColumn, sortDirection, onSort }) => (
  <table className="min-w-full bg-white rounded-lg shadow-md">
    <thead>
      <tr className="bg-indigo-600 text-white text-left">
        <th className="py-3 px-6 w-16">#</th>
        <th className="py-3 px-6 cursor-pointer" onClick={() => onSort('title')}>
          Title
          {sortColumn === 'title' && (
            sortDirection === 'asc' ? <ChevronUp className="inline ml-1" size={16} /> : <ChevronDown className="inline ml-1" size={16} />
          )}
        </th>
        <th className="py-3 px-6 cursor-pointer" onClick={() => onSort('composer')}>
          Composer
          {sortColumn === 'composer' && (
            sortDirection === 'asc' ? <ChevronUp className="inline ml-1" size={16} /> : <ChevronDown className="inline ml-1" size={16} />
          )}
        </th>
        <th className="py-3 px-6 cursor-pointer" onClick={() => onSort('category')}>
          Category
          {sortColumn === 'category' && (
            sortDirection === 'asc' ? <ChevronUp className="inline ml-1" size={16} /> : <ChevronDown className="inline ml-1" size={16} />
          )}
        </th>
        <th className="py-3 px-6 cursor-pointer" onClick={() => onSort('timestamp')}>
          Date Uploaded
          {sortColumn === 'timestamp' && (
            sortDirection === 'asc' ? <ChevronUp className="inline ml-1" size={16} /> : <ChevronDown className="inline ml-1" size={16} />
          )}
        </th>
        <th className="py-3 px-6">Actions</th>
      </tr>
    </thead>
    <tbody>
      {sheets.map((sheet, index) => (
        <tr key={sheet.id} className="border-b border-indigo-200 hover:bg-indigo-50">
          <td className="py-3 px-6 font-semibold">{index + 1}</td>
          <td className="py-3 px-6 font-bold text-indigo-700">{sheet.title}</td>
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

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center items-center space-x-2 mt-4">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-3 py-1 rounded-full bg-indigo-500 text-white disabled:bg-gray-300"
    >
      <ChevronLeft size={20} />
    </button>
    <span className="text-indigo-700">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-3 py-1 rounded-full bg-indigo-500 text-white disabled:bg-gray-300"
    >
      <ChevronRight size={20} />
    </button>
  </div>
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
  const [sortColumn, setSortColumn] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    setCurrentPage(1);
  };

  const handleLetterSearch = (letter) => {
    setSelectedLetter(letter);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handlePreview = (sheet) => {
    setSelectedSheet(sheet);
    setIsModalOpen(true);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredSheets = musicSheets
    .filter(sheet =>
      (searchTerm === '' || 
       sheet.title.toLowerCase().includes(searchTerm) ||
       sheet.composer.toLowerCase().includes(searchTerm) ||
       sheet.category.toLowerCase().includes(searchTerm)) &&
      (selectedLetter === '' || sheet.title.toLowerCase().startsWith(selectedLetter.toLowerCase()))
    )
    .sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredSheets.length / itemsPerPage);
  const paginatedSheets = filteredSheets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-purple-200">
      <div className="sticky top-0 z-10 bg-white shadow-md m-auto">
        <div className="container mx-auto px-4 py-4 mt-20">
          <h1 className="text-4xl font-extrabold text-indigo-800 mb-4 text-center">Kikuyu Music Sheets</h1>

          {/* Alphabet Search - Now Sticky */}
          <div className="flex flex-wrap justify-center mb-4 max-w-3xl mx-auto">
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
          <div className="mb-4 relative max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Search by title, composer, or category..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-4 pl-12 rounded-full border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400" size={20} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center text-indigo-600">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4">Loading music sheets...</p>
          </div>
        ) : (
          <>
            {/* Responsive Layout */}
            <div className="hidden md:block overflow-x-auto">
              <MusicSheetTable 
                sheets={paginatedSheets} 
                onPreview={handlePreview} 
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            </div>
            <div className="md:hidden">
              {paginatedSheets.map((sheet, index) => (
                <MusicSheetCard 
                  key={sheet.id} 
                  sheet={{...sheet, index: (currentPage - 1) * itemsPerPage + index + 1}} 
                  onPreview={handlePreview} 
                />
              ))}
            </div>

            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />

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