import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // To redirect after upload

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

const UploadPage = () => {
  const [title, setTitle] = useState('');
  const [composer, setComposer] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false); // Modal state
  const navigate = useNavigate(); // Hook for navigation

  const auth = getAuth();
  const storage = getStorage();
  const firestore = getFirestore();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setProgress(0);
      setError(null);
      setUploadSuccess(false);
    } else {
      setError('Please select a PDF file.');
      setFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!auth.currentUser) {
      setError('You must be logged in to upload files.');
      return;
    }

    if (!file || !title || !composer || !category) {
      setError('All fields must be filled out!');
      return;
    }

    try {
      setProgress(0);
      setError(null);

      const storageRef = ref(storage, `scores/${auth.currentUser.uid}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.error('Storage error:', error);
          setError(`Upload failed: ${error.message}`);
          setProgress(0);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            await addDoc(collection(firestore, 'scores'), {
              userId: auth.currentUser.uid,
              title,
              composer,
              category,
              fileUrl: downloadURL,
              timestamp: new Date(),
            });

            setUploadSuccess(true);
            setProgress(100);
            setTitle('');
            setComposer('');
            setCategory('');
            setFile(null);
            setShowModal(true); // Show modal on success
          } catch (error) {
            console.error('Firestore error:', error);
            setError(`File uploaded but failed to save details: ${error.message}`);
          }
        }
      );
    } catch (err) {
      console.error('General error:', err);
      setError(`An unexpected error occurred: ${err.message}`);
      setProgress(0);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate('/profile'); // Redirect to profile page
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-300 flex flex-col justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Upload PDF Score</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="composer" className="block text-sm font-medium text-gray-700 mb-1">
              Composer
            </label>
            <input
              type="text"
              id="composer"
              value={composer}
              onChange={(e) => setComposer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
              PDF Score
            </label>
            <input
              type="file"
              id="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            />
          </div>
          {progress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2.5 rounded-full text-center text-white text-xs font-bold"
                style={{ width: `${progress}%` }}
              >
                {Math.round(progress)}%
              </div>
            </div>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {uploadSuccess && (
            <p className="text-green-500 text-sm">Upload successful!</p>
          )}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Upload Score
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold text-center mb-4">Upload Successful!</h3>
            <p className="text-center text-gray-700">Your score has been uploaded successfully.</p>
            <button
              onClick={handleModalClose}
              className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
            >
              Go to Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
