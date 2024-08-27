import React, { useState } from 'react';
import { Search, Music, Calendar, User } from 'lucide-react';

// Dummy data for music sheets (replace this with Firebase data later)
const dummyMusicSheets = [
  { id: 1, name: "Mūthirigu", composer: "Traditional", uploadDate: "2024-03-15" },
  { id: 2, name: "Kīmuru", composer: "John Kamau", uploadDate: "2024-03-10" },
  { id: 3, name: "Mūmbūro", composer: "Mary Wanjiru", uploadDate: "2024-03-05" },
  { id: 4, name: "Njohi Cia Mbembe", composer: "Traditional", uploadDate: "2024-02-28" },
  { id: 5, name: "Kanyoni Ka Kīrīmū", composer: "Peter Kiarie", uploadDate: "2024-02-20" },
  // Add more dummy data as needed
];

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const MusicSheetCard = ({ sheet }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
      <Music className="text-white mx-auto" size={48} />
    </div>
    <div className="p-4">
      <h3 className="text-2xl font-semibold text-blue-900 mb-2">{sheet.name}</h3>
      <p className="text-blue-700 flex items-center mb-1">
        <User size={16} className="mr-2" />
        {sheet.composer}
      </p>
      <p className="text-blue-500 flex items-center">
        <Calendar size={16} className="mr-2" />
        {new Date(sheet.uploadDate).toLocaleDateString()}
      </p>
    </div>
  </div>
);

const MusicSheetsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [musicSheets, setMusicSheets] = useState(dummyMusicSheets);
  const [selectedLetter, setSelectedLetter] = useState('');

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setSelectedLetter('');
    const filteredSheets = dummyMusicSheets.filter(sheet =>
      sheet.name.toLowerCase().includes(term) ||
      sheet.composer.toLowerCase().includes(term)
    );
    setMusicSheets(filteredSheets);
  };

  const handleLetterSearch = (letter) => {
    setSelectedLetter(letter);
    setSearchTerm('');
    const filteredSheets = dummyMusicSheets.filter(sheet =>
      sheet.name.toLowerCase().startsWith(letter.toLowerCase())
    );
    setMusicSheets(filteredSheets);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 mt-11">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-8 text-center">Kikuyu Music Sheets</h1>

        {/* Alphabet Search */}
        <div className="flex justify-center mb-6">
          {alphabet.map(letter => (
            <button
              key={letter}
              onClick={() => handleLetterSearch(letter)}
              className={`px-3 py-1 mx-1 rounded-full border border-blue-300 hover:bg-blue-500 hover:text-white focus:outline-none transition-colors duration-200 ${selectedLetter === letter ? 'bg-blue-500 text-white' : 'text-blue-500'}`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search by name or composer..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-4 pl-12 rounded-full border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
        </div>

        {/* Music Sheets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {musicSheets.map(sheet => (
            <MusicSheetCard key={sheet.id} sheet={sheet} />
          ))}
        </div>

        {/* No Results Found */}
        {musicSheets.length === 0 && (
          <p className="text-center text-blue-600 mt-8">No music sheets found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default MusicSheetsPage;
