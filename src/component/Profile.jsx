import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const auth = getAuth();
  const storage = getStorage();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || '');
        setProfilePic(currentUser.photoURL || '');
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const storageRef = ref(storage, `profile_pictures/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setProfilePic(url);
      await updateProfile(auth.currentUser, { photoURL: url });
      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading profile picture:', error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(auth.currentUser, { displayName, photoURL: profilePic });
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 p-4">
      {user ? (
        <>
          {isEditing ? (
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <div className="flex flex-col items-center mb-4">
                <img
                  src={preview || profilePic || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="w-32 h-32 rounded-full mb-4 border-2 border-gray-300"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="border p-2 rounded"
                />
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-2 hover:bg-blue-700 transition duration-300"
                >
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Display Name"
                  className="border p-2 rounded w-full"
                />
              </div>
              <button
                onClick={handleUpdateProfile}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Update Profile
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300 mt-4"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <div className="flex flex-col items-center mb-4">
                <img
                  src={profilePic || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="w-32 h-32 rounded-full mb-4 border-2 border-gray-300"
                />
                <h2 className="text-xl font-bold">{displayName || 'No Name'}</h2>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Edit Profile
              </button>
            </div>
          )}
          <Link to="/" className="mt-4 text-blue-500 hover:underline">Back to Home</Link>
        </>
      ) : (
        <p className="text-lg">No user is currently logged in.</p>
      )}
    </div>
  );
};

export default ProfilePage;
