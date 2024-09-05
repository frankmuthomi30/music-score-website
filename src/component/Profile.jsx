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

  const handleDeleteScore = async (scoreId) => {
    try {
      const scoreDocRef = doc(firestore, 'scores', scoreId);
      await deleteDoc(scoreDocRef);
      setNotification({ type: 'success', message: 'Score deleted successfully!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to delete score.' });
      console.error('Error deleting score:', error);
    }
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
    <div className="min-h-screen bg-gray-100 p-6 mt-16">
      <div className="max-w-6xl mx-auto">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                {loading ? (
                  <div className="w-full h-full bg-gray-300 animate-pulse" />
                ) : profilePictureURL ? (
                  <img src={profilePictureURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-full h-full p-4 text-gray-400" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{auth.currentUser?.displayName || 'User'}</h2>
                <p className="text-gray-500">{auth.currentUser?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors flex items-center ${signingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {signingOut ? 'Signing Out...' : 'Sign Out'}
            </button>
          </div>
          <div className="flex space-x-2">
            <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center">
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
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Picture
            </button>
          </div>
        </div>

        {/* Scores Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
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
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Composer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {uploadedScores.map(score => (
                    <tr key={score.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{score.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{score.composer}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{score.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{new Date(score.timestamp.toDate()).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {score.fileUrl && (
                            <a
                              href={score.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-900 flex items-center"
                            >
                              <Eye className="w-4 h-4 mr-1" /> View
                            </a>
                          )}
                          <button
                            onClick={() => handleEditScore(score.id)}
                            className="text-yellow-600 hover:text-yellow-900 flex items-center"
                          >
                            <Edit2 className="w-4 h-4 mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteScore(score.id)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit Score Form */}
        {editingScoreId && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
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
          <div className={`mt-6 p-4 rounded-md ${
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