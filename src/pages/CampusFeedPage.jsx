import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import {
  collection, getDocs, addDoc, query, orderBy, 
  serverTimestamp, Timestamp, limit
} from 'firebase/firestore';

const CampusFeedPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'announcements',
    author: '',
    important: false
  });
  const [showCreatePost, setShowCreatePost] = useState(false);

  const categories = [
    { id: 'all', name: 'All Posts', icon: '📋' },
    { id: 'announcements', name: 'Announcements', icon: '📢' },
    { id: 'events', name: 'Events', icon: '🎉' },
    { id: 'academic', name: 'Academic', icon: '📚' },
    { id: 'clubs', name: 'Clubs', icon: '🎭' }
  ];

  // Sample fallback data
  const samplePosts = [
    {
      id: 1,
      type: 'announcements',
      title: 'Library Hours Extended for Exam Period',
      content: 'The central library will remain open 24/7 starting from December 1st to support students during the exam period.',
      author: 'Library Administration',
      time: '2 hours ago',
      likes: 45,
      comments: 12,
      important: true,
      image: null,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      formattedTime: '2 hours ago'
    },
    {
      id: 2,
      type: 'events',
      title: 'Tech Fest 2024 - Registration Now Open',
      content: 'Join us for the biggest tech event of the year! Multiple competitions, workshops, and networking opportunities await.',
      author: 'Student Council',
      time: '4 hours ago',
      likes: 128,
      comments: 34,
      important: false,
      image: '🎪',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      formattedTime: '4 hours ago'
    },
    {
      id: 3,
      type: 'academic',
      title: 'Mid-term Exam Schedule Released',
      content: 'The mid-term examination schedule has been published. Please check your student portal for individual timetables.',
      author: 'Academic Office',
      time: '6 hours ago',
      likes: 89,
      comments: 23,
      important: true,
      image: null,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      formattedTime: '6 hours ago'
    },
    {
      id: 4,
      type: 'clubs',
      title: 'Photography Club Weekend Workshop',
      content: 'Learn advanced photography techniques this weekend. Bring your cameras and join us at the campus garden.',
      author: 'Photography Club',
      time: '1 day ago',
      likes: 67,
      comments: 15,
      important: false,
      image: '📸',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      formattedTime: '1 day ago'
    }
  ];

  // Format timestamp to readable time
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    let date;
    if (timestamp instanceof Timestamp) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }
    
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString();
  };

  // Get category emoji
  const getCategoryEmoji = (category) => {
    const categoryMap = {
      'announcements': '📢',
      'events': '🎉',
      'academic': '📚',
      'clubs': '🎭'
    };
    return categoryMap[category] || '📋';
  };

  // Fetch posts from Firebase
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'campusPosts'), 
          orderBy('createdAt', 'desc'),
          limit(20)
        );
        const querySnapshot = await getDocs(q);
        const postList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          formattedTime: formatTime(doc.data().createdAt)
        }));
        setPosts(postList);
      } catch (error) {
        console.error('Error fetching campus posts:', error);
        // Fallback to sample data if Firebase fails
        setPosts(samplePosts);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPost(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Submit new post
  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim() || !newPost.author.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setPosting(true);
    try {
      const postData = {
        ...newPost,
        type: newPost.category,
        image: getCategoryEmoji(newPost.category),
        likes: 0,
        comments: 0,
        createdAt: serverTimestamp(),
        timestamp: new Date().toISOString()
      };

      // Add to Firebase
      const docRef = await addDoc(collection(db, 'campusPosts'), postData);
      
      // Add to local state for immediate display
      const newPostWithId = {
        id: docRef.id,
        ...postData,
        createdAt: new Date(),
        formattedTime: 'Just now'
      };
      
      setPosts(prev => [newPostWithId, ...prev]);
      
      // Reset form
      setNewPost({
        title: '',
        content: '',
        category: 'announcements',
        author: '',
        important: false
      });
      
      setShowCreatePost(false);
      
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.type === selectedCategory);

  // Calculate stats
  const stats = {
    newPosts: posts.filter(post => {
      const postDate = post.createdAt instanceof Timestamp ? post.createdAt.toDate() : new Date(post.createdAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return postDate >= today;
    }).length,
    totalComments: posts.reduce((sum, post) => sum + (post.comments || 0), 0),
    activeUsers: Math.floor(Math.random() * 1000) + 2000 // Simulated for demo
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-700">Loading Campus Feed...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Campus Feed</h1>
            <p className="text-xl opacity-90">
              Stay connected with your campus community
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-md sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-3">Today's Activity</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Posts</span>
                    <span className="font-semibold">{stats.newPosts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Users</span>
                    <span className="font-semibold">{stats.activeUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Comments</span>
                    <span className="font-semibold">{stats.totalComments}</span>
                  </div>
                </div>
              </div>

              {/* Create Post Button */}
              <button
                onClick={() => setShowCreatePost(true)}
                className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
              >
                ✨ Create New Post
              </button>
            </div>
          </div>

          {/* Main Content - Posts */}
          <div className="lg:col-span-3">
            {/* Quick Create Post */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-md mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  👤
                </div>
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left text-gray-500"
                >
                  What's happening on campus?
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                    <span>📷</span>
                    <span>Photo</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                    <span>📍</span>
                    <span>Location</span>
                  </button>
                </div>
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Post
                </button>
              </div>
            </motion.div>

            {/* Posts List */}
            <div className="space-y-6">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  className={`bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 ${
                    post.important ? 'border-l-4 border-red-500' : ''
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        {post.image || '👤'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{post.author}</h4>
                        <p className="text-sm text-gray-500">{post.formattedTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        post.type === 'announcements' ? 'bg-blue-100 text-blue-600' :
                        post.type === 'events' ? 'bg-purple-100 text-purple-600' :
                        post.type === 'academic' ? 'bg-green-100 text-green-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {categories.find(cat => cat.id === post.type)?.name || 'General'}
                      </span>
                      {post.important && (
                        <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                          Important
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Post Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{post.content}</p>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex space-x-6">
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
                        <span>❤️</span>
                        <span>{post.likes || 0}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                        <span>💬</span>
                        <span>{post.comments || 0}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
                        <span>🔄</span>
                        <span>Share</span>
                      </button>
                    </div>
                    <button className="text-gray-600 hover:text-blue-500 transition-colors">
                      🔖
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300">
                Load More Posts
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Create New Post</h3>
              <button
                onClick={() => setShowCreatePost(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmitPost} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="author"
                  value={newPost.author}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={newPost.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {categories.slice(1).map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={newPost.title}
                  onChange={handleInputChange}
                  placeholder="Enter a catchy title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  name="content"
                  value={newPost.content}
                  onChange={handleInputChange}
                  rows="6"
                  placeholder="What's happening on campus? Share your thoughts..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                ></textarea>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="important"
                  id="important"
                  checked={newPost.important}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="important" className="ml-2 text-sm text-gray-700">
                  Mark as important announcement
                </label>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreatePost(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-600 font-semibold rounded-xl hover:border-gray-400 transition-colors"
                  disabled={posting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={posting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {posting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Posting...
                    </>
                  ) : (
                    <>
                      ✨ Create Post
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampusFeedPage;