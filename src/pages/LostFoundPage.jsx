import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Calendar, User, Star, Phone, Plus, X, Save, Edit3, Mail, CheckCircle, Settings, Shield } from 'lucide-react';

const LostFoundPage = () => {
  const [activeTab, setActiveTab] = useState('lost');
  const [showReportModal, setShowReportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingStatus, setEditingStatus] = useState({});
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [formData, setFormData] = useState({
    type: 'lost',
    item: '',
    description: '',
    location: '',
    category: '',
    reporter: '',
    contact: '',
    reward: ''
  });

  // Sample data for fallback
  const sampleItems = [
    {
      id: '1',
      type: 'lost',
      item: 'iPhone 13 Pro',
      description: 'Black iPhone 13 Pro with blue case. Lost near the library. Has a small scratch on the back cover.',
      location: 'Central Library',
      date: '2024-01-15',
      reporter: 'Priya S.',
      contact: 'priya.s@university.edu',
      reward: '₹2000',
      image: '📱',
      category: 'electronics',
      isStarred: false,
      status: 'active',
      createdAt: new Date('2024-01-15T10:30:00'),
      formattedDate: new Date('2024-01-15T10:30:00').toLocaleDateString()
    },
    {
      id: '2',
      type: 'found',
      item: 'Laptop Charger',
      description: 'Dell laptop charger found in Computer Science building. 65W adapter with original cable.',
      location: 'CS Building - Room 201',
      date: '2024-01-14',
      reporter: 'Rahul K.',
      contact: 'rahul.k@university.edu',
      reward: null,
      image: '🔌',
      category: 'electronics',
      isStarred: true,
      status: 'active',
      createdAt: new Date('2024-01-14T14:20:00'),
      formattedDate: new Date('2024-01-14T14:20:00').toLocaleDateString()
    },
    {
      id: '3',
      type: 'lost',
      item: 'Blue Water Bottle',
      description: 'Insulated blue water bottle with university sticker. Brand: Hydro Flask, 32oz capacity.',
      location: 'Sports Complex',
      date: '2024-01-13',
      reporter: 'Sneha R.',
      contact: 'sneha.r@university.edu',
      reward: null,
      image: '🍶',
      category: 'accessories',
      isStarred: false,
      status: 'found',
      createdAt: new Date('2024-01-13T09:15:00'),
      formattedDate: new Date('2024-01-13T09:15:00').toLocaleDateString()
    }
  ];

  const categories = [
    { id: 'all', name: 'All Items', icon: '📦' },
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'accessories', name: 'Accessories', icon: '👜' },
    { id: 'documents', name: 'Documents', icon: '📄' },
    { id: 'clothing', name: 'Clothing', icon: '👕' },
    { id: 'keys', name: 'Keys', icon: '🔑' },
    { id: 'other', name: 'Other', icon: '📋' }
  ];

  // Handle status update (active/found)
  const handleStatusUpdate = async (itemId, newStatus) => {
    setUpdatingStatus(prev => ({ ...prev, [itemId]: true }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, status: newStatus }
            : item
        )
      );
      
      setEditingStatus(prev => ({ ...prev, [itemId]: false }));
      
    } catch (error) {
      console.error('Error updating item status:', error);
      alert('Error updating status. Please try again.');
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [itemId]: false }));
    }
  };

  // Format Firestore timestamp to readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'No date';
    return new Date(timestamp).toLocaleDateString();
  };

  // Load sample data on component mount
  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setItems(sampleItems);
      setLoading(false);
    };
    loadItems();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const getItemEmoji = (category) => {
        switch (category) {
          case 'electronics': return '📱';
          case 'accessories': return '👜';
          case 'documents': return '📄';
          case 'clothing': return '👕';
          case 'keys': return '🔑';
          default: return '📦';
        }
      };

      const newItem = {
        id: Date.now().toString(),
        ...formData,
        image: getItemEmoji(formData.category),
        isStarred: false,
        status: 'active',
        createdAt: new Date(),
        date: new Date().toISOString().split('T')[0],
        formattedDate: new Date().toLocaleDateString()
      };
      
      setItems(prev => [newItem, ...prev]);
      setFormData({
        type: 'lost',
        item: '',
        description: '',
        location: '',
        category: '',
        reporter: '',
        contact: '',
        reward: ''
      });
      
      setShowReportModal(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error submitting item:', error);
      alert('Error submitting item. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStar = (itemId) => {
    setItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, isStarred: !item.isStarred }
          : item
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'found': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredItems = items.filter(item => {
    const matchesTab = item.type === activeTab;
    const matchesSearch = item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesTab && matchesSearch && matchesCategory;
  });

  const stats = {
    total: items.length,
    lost: items.filter(item => item.type === 'lost').length,
    found: items.filter(item => item.type === 'found').length,
    starred: items.filter(item => item.isStarred).length,
    resolved: items.filter(item => item.status === 'found').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-40 h-40 mx-auto mb-8 relative">
            <div className="absolute inset-0 animate-spin">
              <div className="w-full h-full border-4 border-orange-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-orange-600 rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-4xl animate-pulse">🔍</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Loading Lost & Found</h3>
          <p className="text-gray-600 animate-pulse">Loading items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-6xl">🔍</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Lost & Found</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Help reunite lost items with their owners
          </p>
        </div>

        {/* Admin Toggle */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-2xl transition-all duration-300 ${isAdmin ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-gray-400'}`}>
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Admin Mode</h3>
                <p className="text-sm text-gray-600">Toggle admin privileges to mark items as found/resolved</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-indigo-500"></div>
            </label>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-12 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white min-w-[200px]"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowReportModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center"
            >
              <Plus size={20} className="mr-2" />
              Report Item
            </button>
          </div>

          {/* Tabs */}
          <div className="flex justify-center">
            <div className="flex bg-gray-100 rounded-xl p-1 shadow-inner">
              <button
                onClick={() => setActiveTab('lost')}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'lost'
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-red-500'
                }`}
              >
                Lost Items ({stats.lost})
              </button>
              <button
                onClick={() => setActiveTab('found')}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'found'
                    ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-green-500'
                }`}
              >
                Found Items ({stats.found})
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Items', value: stats.total, color: 'from-purple-500 to-indigo-500', icon: '📦' },
            { label: 'Lost Items', value: stats.lost, color: 'from-red-500 to-orange-500', icon: '🔍' },
            { label: 'Found Items', value: stats.found, color: 'from-green-500 to-teal-500', icon: '✅' },
            { label: 'Starred', value: stats.starred, color: 'from-yellow-500 to-orange-500', icon: '⭐' },
            { label: 'Resolved', value: stats.resolved, color: 'from-emerald-500 to-green-500', icon: '🎉' }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${stat.color}`}></div>
              <div className="p-6 text-center">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <button
                onClick={() => setShowReportModal(true)}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 mb-4"
              >
                Report Item
              </button>
              <button className="w-full px-6 py-3 border-2 border-gray-300 text-gray-600 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-500 transition-all duration-300">
                Browse All Items
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-6">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">💡</span>
                Helpful Tips
              </h4>
              <ul className="text-sm text-gray-600 space-y-3">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  Be specific in descriptions
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  Include exact location details
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-500">•</span>
                  Check regularly for updates
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-2xl shadow-inner">
                          {item.image}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-1">{item.item}</h3>
                          <div className="flex items-center space-x-3">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${
                              item.type === 'lost' 
                                ? 'bg-red-100 text-red-600 border-red-200' 
                                : 'bg-green-100 text-green-600 border-green-200'
                            }`}>
                              {item.type === 'lost' ? 'Lost' : 'Found'}
                            </span>
                            <span className="text-sm text-gray-500">{item.formattedDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.reward && (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-600 border border-yellow-200 rounded-full text-sm font-medium">
                            Reward: {item.reward}
                          </span>
                        )}
                        <button
                          onClick={() => toggleStar(item.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            item.isStarred 
                              ? 'text-yellow-500 bg-yellow-50' 
                              : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                          }`}
                        >
                          <Star size={20} fill={item.isStarred ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-4">{item.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                        <MapPin size={16} className="mr-2 text-gray-400" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                        <User size={16} className="mr-2 text-gray-400" />
                        <span>By {item.reporter}</span>
                      </div>
                    </div>

                    {/* Email Contact */}
                    <div className="flex items-center space-x-2 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Mail size={16} className="text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Contact:</span>
                      <a 
                        href={`mailto:${item.contact}`} 
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
                      >
                        {item.contact}
                      </a>
                    </div>

                    {/* Status and Admin Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {/* Status Display/Editor */}
                        {isAdmin && editingStatus[item.id] ? (
                          <div className="flex items-center space-x-2">
                            <select
                              value={item.status}
                              onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                              className="px-3 py-2 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm font-medium"
                              disabled={updatingStatus[item.id]}
                            >
                              <option value="active">Active</option>
                              <option value="found">Found/Resolved</option>
                            </select>
                            <button
                              onClick={() => setEditingStatus(prev => ({ ...prev, [item.id]: false }))}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              disabled={updatingStatus[item.id]}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center ${getStatusColor(item.status)}`}>
                              {updatingStatus[item.id] ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                              ) : (
                                item.status === 'found' ? <CheckCircle size={16} /> : <Calendar size={16} />
                              )}
                              <span className="ml-2">
                                {updatingStatus[item.id] ? 'Updating...' : (item.status === 'found' ? 'RESOLVED' : 'ACTIVE')}
                              </span>
                            </span>
                            {isAdmin && (
                              <button
                                onClick={() => setEditingStatus(prev => ({ ...prev, [item.id]: true }))}
                                className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors group"
                                disabled={updatingStatus[item.id]}
                              >
                                <Edit3 size={16} className="group-hover:scale-110 transition-transform" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => window.open(`mailto:${item.contact}?subject=Regarding ${item.type} item: ${item.item}`)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center active:scale-95"
                      >
                        <Mail size={16} className="mr-2" />
                        Email {item.reporter}
                      </button>
                    </div>

                    {/* Admin Actions Panel */}
                    {isAdmin && (
                      <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-purple-700">
                            <Settings size={16} />
                            <span className="text-sm font-medium">Admin Controls</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-xs text-purple-600">Quick Status Change:</span>
                            <button
                              onClick={() => handleStatusUpdate(item.id, 'active')}
                              disabled={item.status === 'active' || updatingStatus[item.id]}
                              className={`p-2 rounded-lg transition-all duration-200 ${
                                item.status === 'active' 
                                  ? 'bg-purple-200 text-purple-800 cursor-not-allowed' 
                                  : 'hover:bg-white hover:shadow-md text-purple-600 hover:text-purple-800'
                              }`}
                              title="Mark as Active"
                            >
                              <Calendar size={14} />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(item.id, 'found')}
                              disabled={item.status === 'found' || updatingStatus[item.id]}
                              className={`p-2 rounded-lg transition-all duration-200 ${
                                item.status === 'found' 
                                  ? 'bg-purple-200 text-purple-800 cursor-not-allowed' 
                                  : 'hover:bg-white hover:shadow-md text-purple-600 hover:text-purple-800'
                              }`}
                              title="Mark as Found/Resolved"
                            >
                              <CheckCircle size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length > 0 && (
              <div className="text-center mt-8">
                <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300">
                  Load More Items
                </button>
              </div>
            )}

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <div className="w-32 h-32 mx-auto mb-6 text-gray-300">
                  <span className="text-8xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-500 mb-2">No items found</h3>
                <p className="text-gray-400">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Report an Item</h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="lost">Lost Item</option>
                  <option value="found">Found Item</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  name="item"
                  value={formData.item}
                  onChange={handleInputChange}
                  placeholder="e.g., iPhone, Laptop, Keys"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.slice(1).map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Provide detailed description..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Where was it lost/found?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="reporter"
                  value={formData.reporter}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Information
                </label>
                <input
                  type="email"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="Your email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reward (Optional)
                </label>
                <input
                  type="text"
                  name="reward"
                  value={formData.reward}
                  onChange={handleInputChange}
                  placeholder="e.g., ₹500"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-4 mt-8 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-600 font-semibold rounded-xl hover:border-gray-400 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Submit Report
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-12 max-w-md mx-4 text-center shadow-2xl border-2 border-green-200 transform animate-in zoom-in duration-500">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-4xl">✅</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Item Reported Successfully! 🎉
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Your {formData.type} item has been added to our database. 
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LostFoundPage;