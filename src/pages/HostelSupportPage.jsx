import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Shield, Edit3, X, Clock, CheckCircle, 
  XCircle, Plus, Filter, Home, Users,
  Wrench, Sparkles, Shirt, Pizza, User, Calendar,
  Activity
} from 'lucide-react';
import { db } from '../firebase';
import {
  collection, getDocs, addDoc, query, updateDoc, doc,
  orderBy, serverTimestamp, Timestamp, deleteDoc
} from 'firebase/firestore';

const HostelSupportPage = () => {
  const [activeService, setActiveService] = useState('maintenance');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingStatus, setEditingStatus] = useState({});
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');
  const [requests, setRequests] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [requestForm, setRequestForm] = useState({
    serviceType: 'maintenance',
    roomNumber: '',
    title: '',
    description: '',
    priority: 'medium',
    preferredTime: ''
  });

  const services = [
    {
      id: 'maintenance',
      name: 'Maintenance',
      icon: <Wrench className="w-6 h-6" />,
      description: 'Report and track maintenance issues',
      color: 'blue'
    },
    {
      id: 'cleaning',
      name: 'Cleaning',
      icon: <Sparkles className="w-6 h-6" />,
      description: 'Request cleaning services',
      color: 'green'
    },
    {
      id: 'laundry',
      name: 'Laundry',
      icon: <Shirt className="w-6 h-6" />,
      description: 'Laundry pickup and delivery',
      color: 'purple'
    },
    {
      id: 'food',
      name: 'Food Delivery',
      icon: <Pizza className="w-6 h-6" />,
      description: 'Order meals to your room',
      color: 'orange'
    }
  ];

  // Sample data for fallback
  const sampleRequests = [
    {
      id: '1',
      serviceType: 'maintenance',
      title: 'AC Not Working',
      description: 'Air conditioning unit in room 301 stopped working yesterday.',
      roomNumber: 'Room 301',
      status: 'in-progress',
      priority: 'high',
      createdAt: new Date('2025-01-20T10:30:00'),
      assignedTo: 'Maintenance Team A',
      preferredTime: '2025-01-21T14:00:00',
      formattedDate: new Date('2025-01-20T10:30:00').toLocaleString()
    },
    {
      id: '2',
      serviceType: 'cleaning',
      title: 'Deep Cleaning Request',
      description: 'Weekly deep cleaning service for room 205.',
      roomNumber: 'Room 205',
      status: 'completed',
      priority: 'medium',
      createdAt: new Date('2025-01-19T14:20:00'),
      assignedTo: 'Cleaning Staff',
      preferredTime: '2025-01-20T10:00:00',
      formattedDate: new Date('2025-01-19T14:20:00').toLocaleString()
    },
    {
      id: '3',
      serviceType: 'laundry',
      title: 'Laundry Pickup',
      description: 'Regular laundry pickup and delivery service.',
      roomNumber: 'Room 150',
      status: 'pending',
      priority: 'low',
      createdAt: new Date('2025-01-18T09:15:00'),
      assignedTo: 'Pending Assignment',
      preferredTime: '2025-01-19T16:00:00',
      formattedDate: new Date('2025-01-18T09:15:00').toLocaleString()
    }
  ];

  const sampleFacilities = [
    {
      id: '1',
      name: 'Common Room',
      status: 'available',
      capacity: '25 people',
      amenities: ['TV', 'WiFi', 'AC', 'Gaming'],
      price: 'Free'
    },
    {
      id: '2',
      name: 'Study Hall',
      status: 'occupied',
      capacity: '50 people',
      amenities: ['Silent', 'WiFi', 'Power outlets'],
      price: 'Free'
    },
    {
      id: '3',
      name: 'Gym',
      status: 'available',
      capacity: '15 people',
      amenities: ['Equipment', 'Showers', 'Lockers'],
      price: '₹50/day'
    },
    {
      id: '4',
      name: 'Meeting Room',
      status: 'available',
      capacity: '10 people',
      amenities: ['Projector', 'WiFi', 'Whiteboard'],
      price: '₹100/hour'
    }
  ];

  // Format Firestore timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return 'No date';
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
  };

  // Fetch data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch service requests
        const requestsQuery = query(collection(db, 'hostelRequests'), orderBy('createdAt', 'desc'));
        const requestsSnapshot = await getDocs(requestsQuery);
        const requestsList = requestsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          formattedDate: formatDate(doc.data().createdAt)
        }));
        
        // Fetch facilities
        const facilitiesQuery = query(collection(db, 'hostelFacilities'));
        const facilitiesSnapshot = await getDocs(facilitiesQuery);
        const facilitiesList = facilitiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setRequests(requestsList.length > 0 ? requestsList : sampleRequests);
        setFacilities(facilitiesList.length > 0 ? facilitiesList : sampleFacilities);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to sample data
        setRequests(sampleRequests);
        setFacilities(sampleFacilities);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    setRequestForm({ ...requestForm, [e.target.name]: e.target.value });
  };

  // Submit new request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Only admins can submit requests in this demo');
      return;
    }
    
    setSubmitting(true);
    try {
      const newRequestData = {
        ...requestForm,
        status: 'pending',
        createdAt: serverTimestamp(),
        assignedTo: 'Support Team'
      };
      
      const docRef = await addDoc(collection(db, 'hostelRequests'), newRequestData);
      
      const newRequest = {
        id: docRef.id,
        ...newRequestData,
        createdAt: new Date(),
        formattedDate: new Date().toLocaleString()
      };
      
      setRequests(prev => [newRequest, ...prev]);
      setRequestForm({
        serviceType: 'maintenance',
        roomNumber: '',
        title: '',
        description: '',
        priority: 'medium',
        preferredTime: ''
      });
      
      setShowRequestModal(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Error submitting request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Update request status
  const handleStatusUpdate = async (requestId, newStatus) => {
    if (!isAdmin) {
      alert('Only admins can update request status');
      return;
    }
    
    setUpdatingStatus(prev => ({ ...prev, [requestId]: true }));
    
    try {
      const requestRef = doc(db, 'hostelRequests', requestId);
      await updateDoc(requestRef, { status: newStatus });
      
      setRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status: newStatus }
            : request
        )
      );
      
      setEditingStatus(prev => ({ ...prev, [requestId]: false }));
      
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Error updating status. Please try again.');
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [requestId]: false }));
    }
  };

  // Delete request
  const handleDeleteRequest = async (requestId) => {
    if (!isAdmin) {
      alert('Only admins can delete requests');
      return;
    }
    
    // Replace confirm with a custom modal in production
    const shouldDelete = window.confirm('Are you sure you want to delete this request?');
    if (!shouldDelete) return;
    
    try {
      await deleteDoc(doc(db, 'hostelRequests', requestId));
      setRequests(prev => prev.filter(request => request.id !== requestId));
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Error deleting request. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 border-green-200';
      case 'in-progress': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'pending': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'cancelled': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'in-progress': return <Activity size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const filteredRequests = requests.filter(request => 
    (filterStatus === 'all' || request.status === filterStatus) &&
    (activeService === 'all' || request.serviceType === activeService)
  );

  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-600' },
    { value: 'in-progress', label: 'In Progress', icon: Activity, color: 'text-blue-600' },
    { value: 'completed', label: 'Completed', icon: CheckCircle, color: 'text-green-600' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'text-red-600' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-teal-200 rounded-full opacity-30 animate-bounce"></div>
          <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-blue-200 rounded-full opacity-25 animate-ping"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="w-40 h-40 mx-auto mb-8 relative">
            <div className="absolute inset-0 animate-spin">
              <div className="w-full h-full border-4 border-green-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-green-600 rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Home className="w-8 h-8 text-green-600 animate-pulse" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Loading Hostel Support</h3>
          <p className="text-gray-600 animate-pulse">Preparing your management dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 pt-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-green-200 to-teal-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-gradient-to-br from-blue-200 to-green-200 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute -bottom-24 left-1/4 w-72 h-72 bg-gradient-to-br from-teal-200 to-blue-200 rounded-full opacity-10 animate-ping"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-48 h-48 mx-auto mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-teal-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-2 bg-white rounded-full shadow-2xl flex items-center justify-center">
              <Home className="w-20 h-20 text-green-500" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Hostel Support Management
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            🏠 Complete hostel service management system for administrators
          </p>
        </motion.div>

        {/* Admin Toggle */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-2xl transition-all duration-300 ${isAdmin ? 'bg-gradient-to-r from-green-500 to-teal-500' : 'bg-gray-400'}`}>
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Admin Access Required</h3>
                <p className="text-sm text-gray-600">Toggle admin privileges to access hostel management features</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-teal-500"></div>
            </label>
          </div>
        </div>

        {!isAdmin ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-16 text-center">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-red-200 to-orange-200 rounded-full flex items-center justify-center">
              <Shield className="w-16 h-16 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Access Restricted</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              This hostel support management system is only accessible to authorized administrators. 
              Please enable admin mode using the toggle above to access all features.
            </p>
            <div className="flex items-center justify-center space-x-6 text-gray-500">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Service Management</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Request Tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <Home className="w-5 h-5" />
                <span>Facility Control</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <motion.div 
                className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-white/20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl font-bold text-blue-500 mb-2">{requests.length}</div>
                <div className="text-gray-600">Total Requests</div>
              </motion.div>
              <motion.div 
                className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-white/20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl font-bold text-green-500 mb-2">4.8</div>
                <div className="text-gray-600">Service Rating</div>
              </motion.div>
              <motion.div 
                className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-white/20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl font-bold text-purple-500 mb-2">2h</div>
                <div className="text-gray-600">Avg Response</div>
              </motion.div>
              <motion.div 
                className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-white/20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl font-bold text-orange-500 mb-2">24/7</div>
                <div className="text-gray-600">Support</div>
              </motion.div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Services Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6 border border-white/20">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Services</h3>
                    <button
                      onClick={() => setShowRequestModal(true)}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg text-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <Plus size={16} className="inline mr-1" />
                      New Request
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveService('all')}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        activeService === 'all'
                          ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-lg">🏠</span>
                      <div className="text-left">
                        <div className="font-medium">All Services</div>
                        <div className={`text-xs ${activeService === 'all' ? 'text-green-100' : 'text-gray-500'}`}>
                          View all service requests
                        </div>
                      </div>
                    </button>
                    {services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setActiveService(service.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                          activeService === service.id
                            ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="text-lg">{service.icon}</span>
                        <div className="text-left">
                          <div className="font-medium">{service.name}</div>
                          <div className={`text-xs ${activeService === service.id ? 'text-green-100' : 'text-gray-500'}`}>
                            {service.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Facilities */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Facilities Status</h3>
                  <div className="space-y-4">
                    {facilities.map((facility) => (
                      <div key={facility.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{facility.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            facility.status === 'available' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {facility.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">👥 {facility.capacity}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {facility.amenities?.map((amenity, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {amenity}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-green-600">{facility.price}</span>
                          <div className="space-x-2">
                            <button className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors">
                              Manage
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Service Requests Management</h3>
                    <div className="flex space-x-2">
                      <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="all">All Status</option>
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {filteredRequests.map((request, index) => (
                      <motion.div
                        key={request.id}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-white/50"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">
                                {request.title}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                                {request.priority} priority
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{request.description}</p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Home size={16} className="mr-1" />
                                {request.roomNumber}
                              </div>
                              <div className="flex items-center">
                                <Calendar size={16} className="mr-1" />
                                {request.formattedDate}
                              </div>
                              <div className="flex items-center">
                                <User size={16} className="mr-1" />
                                {request.assignedTo}
                              </div>
                              {request.preferredTime && (
                                <div className="flex items-center">
                                  <Clock size={16} className="mr-1" />
                                  Preferred: {new Date(request.preferredTime).toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            {/* Status Management */}
                            {editingStatus[request.id] ? (
                              <div className="flex items-center space-x-2">
                                <select
                                  value={request.status}
                                  onChange={(e) => handleStatusUpdate(request.id, e.target.value)}
                                  className="px-3 py-2 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-sm font-medium"
                                  disabled={updatingStatus[request.id]}
                                >
                                  {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => setEditingStatus(prev => ({ ...prev, [request.id]: false }))}
                                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  disabled={updatingStatus[request.id]}
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <span className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center ${getStatusColor(request.status)}`}>
                                  {updatingStatus[request.id] ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                                  ) : (
                                    getStatusIcon(request.status)
                                  )}
                                  <span className="ml-2">
                                    {updatingStatus[request.id] ? 'Updating...' : request.status.replace('-', ' ').toUpperCase()}
                                  </span>
                                </span>
                                <button
                                  onClick={() => setEditingStatus(prev => ({ ...prev, [request.id]: true }))}
                                  className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors group"
                                  disabled={updatingStatus[request.id]}
                                >
                                  <Edit3 size={16} className="group-hover:scale-110 transition-transform" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Admin Actions Panel */}
                        <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-green-700">
                              <Settings size={16} />
                              <span className="text-sm font-medium">Admin Controls</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-xs text-green-600">Quick Actions:</span>
                              {statusOptions.map(option => {
                                const IconComponent = option.icon;
                                return (
                                  <button
                                    key={option.value}
                                    onClick={() => handleStatusUpdate(request.id, option.value)}
                                    disabled={request.status === option.value || updatingStatus[request.id]}
                                    className={`p-2 rounded-lg transition-all duration-200 ${
                                      request.status === option.value 
                                        ? 'bg-green-200 text-green-800 cursor-not-allowed' 
                                        : 'hover:bg-white hover:shadow-md text-green-600 hover:text-green-800'
                                    }`}
                                    title={`Set to ${option.label}`}
                                  >
                                    <IconComponent size={14} />
                                  </button>
                                );
                              })}
                              <button
                                onClick={() => handleDeleteRequest(request.id)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors ml-2"
                                title="Delete Request"
                              >
                                <XCircle size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {filteredRequests.length === 0 && (
                    <div className="text-center py-16">
                      <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                        <Home size={64} className="text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-500 mb-3">No requests found</h3>
                      <p className="text-gray-400 text-lg">No service requests match your current filter criteria</p>
                    </div>
                  )}

                  {/* Load More */}
                  {filteredRequests.length > 0 && (
                    <div className="text-center mt-6">
                      <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                        Load More Requests
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Request Modal */}
      {showRequestModal && isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-2xl mr-4">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">New Service Request</h3>
                <p className="text-gray-600 text-sm">Create a new hostel service request</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🏷️ Service Type
                </label>
                <select
                  name="serviceType"
                  value={requestForm.serviceType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🏠 Room Number
                </label>
                <input
                  type="text"
                  name="roomNumber"
                  value={requestForm.roomNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., Room 301"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 Issue Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={requestForm.title}
                  onChange={handleInputChange}
                  placeholder="Brief description of the issue"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📄 Detailed Description
                </label>
                <textarea
                  name="description"
                  value={requestForm.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Provide detailed information about your request..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ⚠️ Priority Level
                </label>
                <select
                  name="priority"
                  value={requestForm.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="high">High (Urgent)</option>
                  <option value="medium">Medium (Normal)</option>
                  <option value="low">Low (When possible)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ⏰ Preferred Time
                </label>
                <input
                  type="datetime-local"
                  name="preferredTime"
                  value={requestForm.preferredTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-70"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : 'Submit Request'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccess && (
        <motion.div
          className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-xl shadow-xl flex items-center space-x-3 z-50"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <CheckCircle size={24} />
          <div>
            <div className="font-bold">Request Submitted!</div>
            <div className="text-sm">Your service request has been created successfully.</div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HostelSupportPage;