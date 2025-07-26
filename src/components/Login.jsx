import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, UserCheck, GraduationCap } from 'lucide-react';
import Lottie from 'lottie-react';
import loginAnimation from '../assets/animations/Login.json';
import loaderAnimation from '../assets/animations/loader.json';
import successAnimation from '../assets/animations/Success.json';

import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    rollNumber: '',
    hostelBlock: ''
  });
  const [userType, setUserType] = useState('student');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate(); // 🚀 Navigation hook
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    if (isLogin) {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
    } else {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        userType,
        rollNumber: formData.rollNumber,
        hostelBlock: formData.hostelBlock
      });
    }

    navigate('navigation');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  } catch (error) {
    console.error('Authentication error:', error);
    alert(error.message);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[700px]">
          {/* Left Side - Form */}
          <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              {/* Logo */}
              <div className="flex items-center justify-center mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl mr-3">
                  <GraduationCap className="text-white" size={32} />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CampusLink
                </span>
              </div>

              {/* Form Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {isLogin ? 'Welcome Back!' : 'Join CampusLink'}
                </h1>
                <p className="text-gray-600">
                  {isLogin 
                    ? 'Sign in to access your campus utilities' 
                    : 'Create your account to get started'
                  }
                </p>
              </div>

              {/* User Type Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                <button
                  type="button"
                  className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg transition-all duration-200 ${
                    userType === 'student' 
                      ? 'bg-white shadow-md text-blue-600' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setUserType('student')}
                >
                  <User size={18} className="mr-2" />
                  Student
                </button>
                <button
                  type="button"
                  className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg transition-all duration-200 ${
                    userType === 'admin' 
                      ? 'bg-white shadow-md text-blue-600' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setUserType('admin')}
                >
                  <UserCheck size={18} className="mr-2" />
                  Admin
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>
                    </div>

                    {userType === 'student' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Roll Number
                          </label>
                          <input
                            type="text"
                            name="rollNumber"
                            placeholder="Your roll number"
                            value={formData.rollNumber}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hostel Block
                          </label>
                          <select
                            name="hostelBlock"
                            value={formData.hostelBlock}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            required
                          >
                            <option value="">Select block</option>
                            <option value="Block A">Block A</option>
                            <option value="Block B">Block B</option>
                            <option value="Block C">Block C</option>
                            <option value="Block D">Block D</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <Lottie 
                      animationData={loaderAnimation} 
                      loop={true} 
                      className="w-6 h-6 mr-2"
                    />
                  ) : null}
                  {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                </button>

                <div className="text-center">
                  <p className="text-gray-600">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                      type="button"
                      onClick={toggleForm}
                      className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                    >
                      {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Right Side - Animation */}
          <div className="flex-1 bg-gradient-to-br from-blue-600 to-purple-700 p-8 lg:p-12 flex items-center justify-center relative">
            <div className="max-w-lg text-white text-center">
              {/* Main Login Animation */}
              <div className="mb-8">
                <Lottie 
                  animationData={loginAnimation} 
                  loop={true} 
                  className="w-full h-80 mx-auto"
                />
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                <h3 className="text-2xl font-bold mb-4">Welcome to CampusLink</h3>
                <p className="text-blue-100 text-lg">
                  Your all-in-one platform for campus life management
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl mb-2">📢</div>
                  <div className="text-sm font-medium">Campus Updates</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl mb-2">📚</div>
                  <div className="text-sm font-medium">Lost & Found</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl mb-2">📅</div>
                  <div className="text-sm font-medium">Timetables</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl mb-2">🏠</div>
                  <div className="text-sm font-medium">Hostel Support</div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-3">
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                  🎓 Student Life
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                  📱 Easy Access
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                  🔒 Secure
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm mx-4 text-center">
            <Lottie 
              animationData={successAnimation} 
              loop={false} 
              className="w-32 h-32 mx-auto mb-4"
            />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {isLogin ? 'Welcome Back!' : 'Account Created!'}
            </h3>
            <p className="text-gray-600">
              {isLogin ? 'Successfully signed in to your account' : 'Your account has been created successfully'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;