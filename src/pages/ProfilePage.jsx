import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { User, Mail, Lock, Eye, EyeOff, GraduationCap, Home, BookOpen, Clock, LogOut, Edit } from 'lucide-react';
import Lottie from 'lottie-react';
import profileAnimation from '../assets/animations/Profile.json'; // Make sure this file exists
import successAnimation from '../assets/animations/Success.json';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    hostelBlock: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            setFormData({
              name: data.name || '',
              email: currentUser.email || '',
              rollNumber: data.rollNumber || '',
              hostelBlock: data.hostelBlock || ''
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name: formData.name,
        rollNumber: formData.rollNumber,
        hostelBlock: formData.hostelBlock
      });
      setUserData({
        ...userData,
        name: formData.name,
        rollNumber: formData.rollNumber,
        hostelBlock: formData.hostelBlock
      });
      setEditMode(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[700px]">
          {/* Left Side - Profile Info */}
          <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl mr-3">
                    <GraduationCap className="text-white" size={32} />
                  </div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    My Profile
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-500 hover:text-red-700"
                  title="Logout"
                >
                  <LogOut size={20} className="mr-1" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>

              {/* Profile Picture Placeholder */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                    <User size={48} className="text-blue-600" />
                  </div>
                  {editMode && (
                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition-colors">
                      <Edit size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Profile Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      disabled={!editMode}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed"
                      disabled
                    />
                  </div>
                </div>

                {userData?.userType === 'student' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Roll Number
                      </label>
                      <div className="relative">
                        <BookOpen size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="rollNumber"
                          value={formData.rollNumber}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          disabled={!editMode}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hostel Block
                      </label>
                      <div className="relative">
                        <Home size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                          name="hostelBlock"
                          value={formData.hostelBlock}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          disabled={!editMode}
                        >
                          <option value="">Select block</option>
                          <option value="Block A">Block A</option>
                          <option value="Block B">Block B</option>
                          <option value="Block C">Block C</option>
                          <option value="Block D">Block D</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Created
                  </label>
                  <div className="relative">
                    <Clock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={new Date(currentUser.metadata.creationTime).toLocaleDateString()}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed"
                      disabled
                    />
                  </div>
                </div>

                <div className="pt-4">
                  {editMode ? (
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSave}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditMode(false)}
                        className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditMode(true)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Animation */}
          <div className="flex-1 bg-gradient-to-br from-blue-600 to-purple-700 p-8 lg:p-12 flex items-center justify-center relative">
            <div className="max-w-lg text-white text-center">
              {/* Profile Animation */}
              <div className="mb-8">
                <Lottie 
                  animationData={profileAnimation} 
                  loop={true} 
                  className="w-full h-80 mx-auto"
                />
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                <h3 className="text-2xl font-bold mb-4">Welcome {userData?.name || 'User'}!</h3>
                <p className="text-blue-100 text-lg">
                  {userData?.userType === 'admin' 
                    ? 'You have administrative privileges' 
                    : 'Manage your campus profile and settings'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl mb-2">👤</div>
                  <div className="text-sm font-medium">Personal Info</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl mb-2">🔒</div>
                  <div className="text-sm font-medium">Security</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl mb-2">⚙️</div>
                  <div className="text-sm font-medium">Settings</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl mb-2">📱</div>
                  <div className="text-sm font-medium">Preferences</div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-3">
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                  {userData?.userType === 'admin' ? '🛡️ Admin' : '🎓 Student'}
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                  {userData?.hostelBlock || 'No Hostel'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm mx-4 text-center">
            <Lottie 
              animationData={successAnimation} 
              loop={false} 
              className="w-32 h-32 mx-auto mb-4"
            />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Profile Updated!
            </h3>
            <p className="text-gray-600">
              Your changes have been saved successfully
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;