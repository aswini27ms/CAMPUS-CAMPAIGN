import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, Send, FileText, Mail, Clock,
  CheckCircle, XCircle, Filter, Plus, Zap, Target,
  Settings, Shield, Edit3, Save, X
} from 'lucide-react';
import { db } from '../firebase';
import {
  collection, getDocs, addDoc, query, updateDoc, doc,
  orderBy, serverTimestamp, Timestamp
} from 'firebase/firestore';

const ComplaintPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingStatus, setEditingStatus] = useState({});
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    priority: 'medium',
    location: '',
    contact: ''
  });

  // Sample complaints data for demo
  const sampleComplaints = [
    {
      id: '1',
      title: 'Broken AC in Library',
      category: 'Maintenance',
      description: 'The air conditioning system in the main library has been malfunctioning for the past week.',
      priority: 'high',
      location: 'Main Library, 2nd Floor',
      contact: 'student@university.edu',
      status: 'pending',
      createdAt: new Date('2025-01-20T10:30:00'),
      assignedTo: 'Maintenance Team',
      formattedDate: new Date('2025-01-20T10:30:00').toLocaleString()
    },
    {
      id: '2',
      title: 'WiFi Connectivity Issues',
      category: 'Technical',
      description: 'Students are experiencing frequent WiFi disconnections in the dormitory.',
      priority: 'medium',
      location: 'West Dormitory',
      contact: 'student2@university.edu',
      status: 'in-progress',
      createdAt: new Date('2025-01-19T14:20:00'),
      assignedTo: 'IT Support',
      formattedDate: new Date('2025-01-19T14:20:00').toLocaleString()
    },
    {
      id: '3',
      title: 'Food Quality Concern',
      category: 'Food Services',
      description: 'Several students reported food poisoning symptoms after eating at the cafeteria.',
      priority: 'high',
      location: 'Main Cafeteria',
      contact: 'health@university.edu',
      status: 'resolved',
      createdAt: new Date('2025-01-18T09:15:00'),
      assignedTo: 'Food Safety Team',
      formattedDate: new Date('2025-01-18T09:15:00').toLocaleString()
    }
  ];

  // Format Firestore timestamp to readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'No date';
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const complaintList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          formattedDate: formatDate(doc.data().createdAt)
        }));
        setComplaints(complaintList);
      } catch (error) {
        console.error('Error fetching complaints:', error);
        // Fallback to sample data if Firebase fails
        setComplaints(sampleComplaints);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Create new complaint object
      const newComplaintData = {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp(),
        assignedTo: 'Support Team'
      };
      
      // Add to Firebase
      const docRef = await addDoc(collection(db, 'complaints'), newComplaintData);
      
      // Create the complaint object with the new ID for local state
      const newComplaint = {
        id: docRef.id,
        ...newComplaintData,
        createdAt: new Date(), // Use current date for immediate display
        formattedDate: new Date().toLocaleString()
      };
      
      // Update local state
      setComplaints(prev => [newComplaint, ...prev]);
      
      // Reset form
      setFormData({
        title: '', category: '', description: '',
        priority: 'medium', location: '', contact: ''
      });
      
      setShowForm(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('Error submitting complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (complaintId, newStatus) => {
    setUpdatingStatus(prev => ({ ...prev, [complaintId]: true }));
    
    try {
      // Update in Firebase
      const complaintRef = doc(db, 'complaints', complaintId);
      await updateDoc(complaintRef, {
        status: newStatus
      });
      
      // Update local state
      setComplaints(prev => 
        prev.map(complaint => 
          complaint.id === complaintId 
            ? { ...complaint, status: newStatus }
            : complaint
        )
      );
      
      setEditingStatus(prev => ({ ...prev, [complaintId]: false }));
      
    } catch (error) {
      console.error('Error updating complaint status:', error);
      alert('Error updating status. Please try again.');
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [complaintId]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'in-progress': return <AlertTriangle size={16} />;
      case 'resolved': return <CheckCircle size={16} />;
      case 'rejected': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const filteredComplaints = complaints.filter(complaint => 
    filterStatus === 'all' || complaint.status === filterStatus
  );

  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-600' },
    { value: 'in-progress', label: 'In Progress', icon: AlertTriangle, color: 'text-blue-600' },
    { value: 'resolved', label: 'Resolved', icon: CheckCircle, color: 'text-green-600' },
    { value: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-600' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-orange-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-red-200 rounded-full opacity-30 animate-bounce"></div>
          <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-pink-200 rounded-full opacity-25 animate-ping"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-orange-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="w-40 h-40 mx-auto mb-8 relative">
            <div className="absolute inset-0 animate-spin">
              <div className="w-full h-full border-4 border-orange-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-orange-600 rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-8 h-8 text-orange-600 animate-pulse" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Loading Complaints System</h3>
          <p className="text-gray-600 animate-pulse">Preparing your support dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 pt-20 pb-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-orange-200 to-red-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-gradient-to-br from-pink-200 to-orange-200 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute -bottom-24 left-1/4 w-72 h-72 bg-gradient-to-br from-red-200 to-pink-200 rounded-full opacity-10 animate-ping"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="w-56 h-56 mx-auto mb-10 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-2 bg-white rounded-full shadow-2xl flex items-center justify-center">
              <AlertTriangle className="w-24 h-24 text-orange-500" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Campus Complaints
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              🎯 Report issues and track their resolution status with our intelligent support system
            </p>
            <div className="flex items-center justify-center space-x-8 mt-8">
              <div className="flex items-center space-x-2 text-orange-600">
                <Target className="w-5 h-5" />
                <span className="font-medium">Quick Resolution</span>
              </div>
              <div className="flex items-center space-x-2 text-red-600">
                <Zap className="w-5 h-5" />
                <span className="font-medium">Real-time Tracking</span>
              </div>
              <div className="flex items-center space-x-2 text-pink-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">24/7 Support</span>
              </div>
            </div>
          </div>
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
                <p className="text-sm text-gray-600">Toggle admin privileges to manage complaint statuses</p>
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

        {/* Action Buttons */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="group flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="bg-white/20 p-2 rounded-lg mr-3 group-hover:bg-white/30 transition-colors">
                  <Plus size={24} />
                </div>
                New Complaint
              </button>
              
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-12 pr-8 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300 bg-white shadow-lg hover:shadow-xl font-medium"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{complaints.length}</div>
                <div className="text-sm text-gray-600 font-medium">Total Issues</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {complaints.filter(c => c.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {complaints.filter(c => c.status === 'resolved').length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Resolved</div>
              </div>
            </div>
          </div>
        </div>

        {/* Complaint Form */}
        {showForm && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-10 mb-12 transform transition-all duration-500">
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-2xl mr-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Submit New Complaint
                </h2>
                <p className="text-gray-600 mt-1">Help us resolve your issue quickly and efficiently</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-3 group-focus-within:text-orange-600 transition-colors">
                    📝 Complaint Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Brief description of your issue..."
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300 bg-gray-50 hover:bg-white font-medium shadow-inner hover:shadow-lg"
                    required
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-3 group-focus-within:text-orange-600 transition-colors">
                    🏷 Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300 bg-gray-50 hover:bg-white font-medium shadow-inner hover:shadow-lg"
                    required
                  >
                    <option value="">🔽 Select Category</option>
                    <option value="Maintenance">🔧 Maintenance</option>
                    <option value="Technical">💻 Technical</option>
                    <option value="Food Services">🍽 Food Services</option>
                    <option value="Security">🔒 Security</option>
                    <option value="Academics">📚 Academics</option>
                    <option value="Other">📋 Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact</label>
                  <input
                    type="email"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-6 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none font-bold shadow-xl hover:shadow-2xl"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <div className="bg-white/20 p-1 rounded-lg mr-3 group-hover:bg-white/30 transition-colors">
                        <Send size={18} />
                      </div>
                      Submit Complaint
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Complaints List */}
        <div className="space-y-6">
          {filteredComplaints.map((complaint) => (
            <div key={complaint.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{complaint.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span className="bg-gray-100 px-3 py-1 rounded-full">{complaint.category}</span>
                      <span>{complaint.formattedDate}</span>
                      <span>Assigned to: {complaint.assignedTo}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{complaint.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FileText size={16} className="mr-1" />
                        {complaint.location}
                      </div>
                      <div className="flex items-center">
                        <Mail size={16} className="mr-1" />
                        {complaint.contact}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {/* Status Display/Editor */}
                    {isAdmin && editingStatus[complaint.id] ? (
                      <div className="flex items-center space-x-2">
                        <select
                          value={complaint.status}
                          onChange={(e) => handleStatusUpdate(complaint.id, e.target.value)}
                          className="px-3 py-2 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm font-medium"
                          disabled={updatingStatus[complaint.id]}
                        >
                          {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => setEditingStatus(prev => ({ ...prev, [complaint.id]: false }))}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          disabled={updatingStatus[complaint.id]}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center ${getStatusColor(complaint.status)}`}>
                          {updatingStatus[complaint.id] ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                          ) : (
                            getStatusIcon(complaint.status)
                          )}
                          <span className="ml-2">
                            {updatingStatus[complaint.id] ? 'Updating...' : complaint.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </span>
                        {isAdmin && (
                          <button
                            onClick={() => setEditingStatus(prev => ({ ...prev, [complaint.id]: true }))}
                            className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors group"
                            disabled={updatingStatus[complaint.id]}
                          >
                            <Edit3 size={16} className="group-hover:scale-110 transition-transform" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
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
                        {statusOptions.map(option => {
                          const IconComponent = option.icon;
                          return (
                            <button
                              key={option.value}
                              onClick={() => handleStatusUpdate(complaint.id, option.value)}
                              disabled={complaint.status === option.value || updatingStatus[complaint.id]}
                              className={`p-2 rounded-lg transition-all duration-200 ${
                                complaint.status === option.value 
                                  ? 'bg-purple-200 text-purple-800 cursor-not-allowed' 
                                  : 'hover:bg-white hover:shadow-md text-purple-600 hover:text-purple-800'
                              }`}
                              title={`Set to ${option.label}`}
                            >
                              <IconComponent size={14} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredComplaints.length === 0 && (
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
              <AlertTriangle size={64} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-500 mb-3">No complaints found</h3>
            <p className="text-gray-400 text-lg">No complaints match your current filter criteria</p>
          </div>
        )}
      </div>
      
      {/* Success Animation Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-12 max-w-md mx-4 text-center shadow-2xl border-2 border-green-200 transform animate-in zoom-in duration-500">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Complaint Submitted Successfully! 🎉
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Your complaint has been registered and our support team will review it shortly. 
              You'll receive updates on the resolution progress.
            </p>
            <div className="mt-6 flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle size={20} />
              <span className="font-medium">Ticket #C{complaints.length + 1} Created</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ComplaintPage;