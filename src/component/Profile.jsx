import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { Upload, Edit2, Trash2, Eye, User, LogOut, Loader } from 'lucide-react';

const ProfilePage = () => {
  const [profilePictureURL, setProfilePictureURL] = useState('');
  const [uploadedScores, setUploadedScores] = useState([]);
  const [editingScoreId, setEditingScoreId] = useState(null);
  const [title, setTitle] = useState('');
  const [composer, setComposer] = useState('');
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingScoreId, setDeletingScoreId] = useState(null);
  const [signingOut, setSigningOut] = useState(false);
  const navigate = useNavigate();

  const auth = getAuth();
  const firestore = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    if (auth.currentUser) {
      fetchProfilePicture();
      fetchScores();
    }
  }, [auth.currentUser]);

  const fetchProfilePicture = async () => {
    const profilePicRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
    try {
      const url = await getDownloadURL(profilePicRef);
      setProfilePictureURL(url);
    } catch (error) {
      console.error('Failed to fetch profile picture:', error);
    }
  };

  const fetchScores = async () => {
    const q = query(collection(firestore, 'scores'), where('userId', '==', auth.currentUser.uid));
    onSnapshot(q, (snapshot) => {
      const scores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUploadedScores(scores);
      setLoading(false);
    }, (error) => {
      console.error('Failed to fetch scores:', error);
      setLoading(false);
    });
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const profilePicRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
      try {
        await uploadBytes(profilePicRef, file);
        const url = await getDownloadURL(profilePicRef);
        setProfilePictureURL(url);
        setNotification({ type: 'success', message: 'Profile picture updated successfully!' });
      } catch (error) {
        console.error('Failed to upload profile picture:', error);
        setNotification({ type: 'error', message: 'Failed to update profile picture.' });
      }
    }
  };

  const handleRemoveProfilePicture = async () => {
    const profilePicRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
    try {
      await deleteObject(profilePicRef);
      setProfilePictureURL('');
      setNotification({ type: 'success', message: 'Profile picture removed successfully!' });
    } catch (error) {
      console.error('Failed to remove profile picture:', error);
      setNotification({ type: 'error', message: 'Failed to remove profile picture.' });
    }
  };

  const handleEditScore = (scoreId) => {
    setEditingScoreId(scoreId);
    const score = uploadedScores.find(score => score.id === scoreId);
    if (score) {
      setTitle(score.title);
      setComposer(score.composer);
    }
  };

  const handleSaveEdit = async () => {
    if (editingScoreId) {
      try {
        const scoreDocRef = doc(firestore, 'scores', editingScoreId);
        await updateDoc(scoreDocRef, { title, composer, updatedAt: new Date() });
        setNotification({ type: 'success', message: 'Score updated successfully!' });
        setEditingScoreId(null);
        setTitle('');
        setComposer('');
      } catch (error) {
        setNotification({ type: 'error', message: 'Failed to update score.' });
        console.error('Error updating score:', error);
      }
    }
  };

  const confirmDeleteScore = async () => {
    if (deletingScoreId) {
      try {
        const scoreDocRef = doc(firestore, 'scores', deletingScoreId);
        await deleteDoc(scoreDocRef);
        setNotification({ type: 'success', message: 'Score deleted successfully!' });
        setDeletingScoreId(null);
      } catch (error) {
        setNotification({ type: 'error', message: 'Failed to delete score.' });
        console.error('Error deleting score:', error);
      }
    }
  };

  const handleDeleteScore = (scoreId) => {
    setDeletingScoreId(scoreId);
  };

  const cancelDeleteScore = () => {
    setDeletingScoreId(null);
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut(auth);
      setNotification({ type: 'success', message: 'Signed out successfully!' });
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (error) {
      console.error('Error signing out:', error);
      setNotification({ type: 'error', message: 'Failed to sign out. Please try again.' });
      setSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 mt-16">
      <div className="max-w-6xl mx-auto">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-between mb-6">
            <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-0">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                {loading ? (
                  <div className="w-full h-full bg-gray-300 animate-pulse" />
                ) : profilePictureURL ? (
                  <img src={profilePictureURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-full h-full p-4 text-gray-400" />
                )}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold">{auth.currentUser?.displayName || 'User'}</h2>
                <p className="text-gray-500">{auth.currentUser?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className={`mt-4 sm:mt-0 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors flex items-center justify-center ${signingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {signingOut ? 'Signing Out...' : 'Sign Out'}
            </button>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center justify-center">
              <Upload className="w-4 h-4 mr-2" />
              Update Picture
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
            </label>
            <button
              onClick={handleRemoveProfilePicture}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors flex items-center justify-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Picture
            </button>
          </div>
        </div>

        {/* Scores Section */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-xl font-semibold mb-4">Uploaded Scores</h2>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-12 bg-gray-300 rounded animate-pulse" />
              ))}
            </div>
          ) : uploadedScores.length === 0 ? (
            <p className="text-gray-500">No scores uploaded yet.</p>
          ) : (
            <>
              {/* Cards for Small Screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {uploadedScores.map(score => (
                  <div key={score.id} className="bg-white shadow-md rounded-lg p-4">
                    <h3 className="text-lg font-semibold">{score.title}</h3>
                    <p className="text-gray-500">Composer: {score.composer}</p>
                    <p className="text-gray-500">Category: {score.category}</p>
                    <p className="text-gray-500">Uploaded: {new Date(score.timestamp.toDate()).toLocaleDateString()}</p>
                    <div className="flex justify-end space-x-2 mt-2">
                      {score.fileUrl && (
                        <a
                          href={score.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </a>
                      )}
                      <button
                        onClick={() => handleEditScore(score.id)}
                        className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500 transition-colors flex items-center"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteScore(score.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal for Delete Confirmation */}
              {deletingScoreId && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
                  <div className="bg-white rounded-lg shadow-md p-6 max-w-sm mx-auto">
                    <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
                    <p>Are you sure you want to delete this score?</p>
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={confirmDeleteScore}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={cancelDeleteScore}
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Edit Score Form */}
        {editingScoreId && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Edit Score</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="Score title"
                />
              </div>
              <div>
                <label htmlFor="composer" className="block text-sm font-medium text-gray-700">Composer</label>
                <input
                  id="composer"
                  type="text"
                  value={composer}
                  onChange={(e) => setComposer(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="Composer name"
                />
              </div>
            </div>
            <button
              onClick={handleSaveEdit}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}

        {/* Notification */}
        {notification && (
          <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-md ${
            notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            <p className="font-bold">{notification.type === 'error' ? 'Error' : 'Success'}</p>
            <p>{notification.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;