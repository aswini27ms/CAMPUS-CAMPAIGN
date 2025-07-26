import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc, 
  updateDoc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { 
  Calendar, 
  Clock, 
  User, 
  Users, 
  BookOpen, 
  MessageSquare, 
  CheckCircle, 
  Video,
  ChevronLeft,
  ChevronRight,
  Filter,
  Star,
  Award
} from 'lucide-react';
import Lottie from 'lottie-react';
import scheduleAnimation from '../assets/animations/Schedule.json';

const SessionBookingPage = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionType, setSessionType] = useState('study-group');
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [formData, setFormData] = useState({
    topic: '',
    duration: '60',
    description: '',
    mentorId: ''
  });
  const [bookedSessions, setBookedSessions] = useState([]);
  const [showBookedSessions, setShowBookedSessions] = useState(false);
  const [mentors, setMentors] = useState([]);

  const sessionTypes = [
    {
      id: 'study-group',
      name: 'Study Group',
      icon: Users,
      description: 'Collaborative learning sessions',
      color: 'bg-purple-500',
      duration: [60, 90, 120]
    },
    {
      id: 'mentoring',
      name: 'Mentoring',
      icon: User,
      description: 'One-on-one guidance sessions',
      color: 'bg-pink-500',
      duration: [30, 45, 60]
    },
    {
      id: 'consultation',
      name: 'Consultation',
      icon: MessageSquare,
      description: 'Expert advice and support',
      color: 'bg-indigo-500',
      duration: [30, 60, 90]
    }
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  // Authentication state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch mentors from Firebase
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'mentors'));
        const mentorsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // If no mentors in database, add some sample data for testing
        if (mentorsData.length === 0) {
          console.log('No mentors found in database. You may want to add some mentors to the "mentors" collection in Firebase.');
        }
        
        setMentors(mentorsData);
      } catch (error) {
        console.error("Error fetching mentors: ", error);
        // Fallback to empty array if there's an error
        setMentors([]);
      }
    };
    
    fetchMentors();
  }, []);

  // Fetch booked sessions for the current user
  useEffect(() => {
    const fetchBookedSessions = async () => {
      if (user) {
        try {
          const q = query(
            collection(db, 'sessions'),
            where('studentId', '==', user.uid),
            orderBy('createdAt', 'desc')
          );
          const querySnapshot = await getDocs(q);
          const sessions = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert Firestore timestamps to JavaScript dates if needed
            date: doc.data().date?.toDate ? doc.data().date.toDate() : new Date(doc.data().date),
            createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt)
          }));
          setBookedSessions(sessions);
        } catch (error) {
          console.error("Error fetching booked sessions: ", error);
        }
      }
    };
    
    fetchBookedSessions();
  }, [user, bookingSuccess]);

  const getAvailableSlots = () => {
    if (sessionType === 'mentoring' && formData.mentorId) {
      const mentor = mentors.find(m => m.id === formData.mentorId);
      return mentor ? mentor.availability : timeSlots;
    }
    return timeSlots;
  };

  const handleDateChange = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction);
    setSelectedDate(newDate);
  };

  const handleSessionSelect = (time) => {
    setSelectedSession(time);
    setShowBookingForm(true);
  };

  const generateMeetingLink = () => {
    // Generate a unique meeting room ID
    const roomId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return `https://meet.jit.si/studysession-${roomId}`;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setBookingError('');
    
    try {
      // Validate required fields
      if (!formData.topic.trim()) {
        throw new Error('Please enter a session topic');
      }

      if (sessionType === 'mentoring' && mentors.length > 0 && !formData.mentorId) {
        throw new Error('Please select a mentor for mentoring sessions');
      }

      // Create session data object
      const sessionData = {
        // Student information
        studentId: user.uid,
        studentName: user.displayName || user.email.split('@')[0],
        studentEmail: user.email,
        
        // Mentor information (if applicable)
        mentorId: formData.mentorId || null,
        mentorName: formData.mentorId ? 
          mentors.find(m => m.id === formData.mentorId)?.name || 'Unknown Mentor' : 
          'Group Session',
        
        // Session details
        type: sessionType,
        topic: formData.topic.trim(),
        description: formData.description.trim() || '',
        duration: parseInt(formData.duration),
        
        // Date and time - store as Firestore Timestamp
        date: Timestamp.fromDate(selectedDate),
        time: selectedSession,
        
        // Status and links
        status: 'booked',
        meetingLink: generateMeetingLink(),
        
        // Timestamps
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        
        // Additional metadata
        sessionId: `${sessionType}-${Date.now()}`,
        isActive: true
      };

      console.log('Saving session data:', sessionData);

      // Save to Firebase Firestore
      const docRef = await addDoc(collection(db, 'sessions'), sessionData);
      
      console.log('Session booked successfully with ID:', docRef.id);
      
      // Reset form and show success
      setBookingSuccess(true);
      setShowBookingForm(false);
      setSelectedSession(null);
      setFormData({
        topic: '',
        duration: '60',
        description: '',
        mentorId: ''
      });

      // Auto-hide success modal after 3 seconds
      setTimeout(() => {
        setBookingSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error("Booking failed: ", error);
      setBookingError(error.message || 'Failed to book session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatSessionDate = (date) => {
    const sessionDate = date instanceof Date ? date : new Date(date);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return sessionDate.toLocaleDateString('en-US', options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'booked': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isSlotAvailable = (time) => {
    const hour = parseInt(time.split(':')[0]);
    return hour >= 9 && hour <= 20;
  };

  // Check if user is authenticated
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6">
            <Lottie animationData={scheduleAnimation} loop={true} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading...</h2>
          <p className="text-gray-600">Checking authentication</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600">Please sign in to book sessions.</p>
        </div>
      </div>
    );
  }

  if (isLoading && !showBookingForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6">
            <Lottie animationData={scheduleAnimation} loop={true} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Session Booking...</h2>
          <p className="text-gray-600">Finding available slots for you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Session Booking
              </h1>
              <p className="text-gray-600 mt-1">Book study sessions, mentoring, and consultations</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowBookedSessions(!showBookedSessions)}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {showBookedSessions ? 'Hide My Sessions' : 'Show My Sessions'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Message */}
        {bookingError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">⚠️</div>
              <p className="text-red-800">{bookingError}</p>
              <button 
                onClick={() => setBookingError('')}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Display booked sessions when toggled */}
        {showBookedSessions && (
          <div className="mb-12 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                My Booked Sessions
              </h2>
              <p className="text-gray-600 mt-1">View and manage your upcoming sessions</p>
            </div>

            {bookedSessions.length === 0 ? (
              <div className="p-8 text-center">
                <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Sessions Booked Yet</h3>
                <p className="text-gray-500">You haven't booked any sessions yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {bookedSessions.map(session => (
                  <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{session.topic}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(session.status)}`}>
                            {session.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{session.description || 'No description'}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center text-gray-700">
                            <Calendar className="mr-2 text-purple-600" size={16} />
                            {formatSessionDate(session.date)}
                          </div>
                          <div className="flex items-center text-gray-700">
                            <Clock className="mr-2 text-purple-600" size={16} />
                            {session.time} ({session.duration} mins)
                          </div>
                          <div className="flex items-center text-gray-700">
                            {session.type === 'mentoring' ? (
                              <User className="mr-2 text-purple-600" size={16} />
                            ) : (
                              <Users className="mr-2 text-purple-600" size={16} />
                            )}
                            {session.mentorName || 'Group Session'}
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {session.meetingLink && (
                          <a
                            href={session.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
                          >
                            <Video size={16} />
                            Join
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Session Type Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Filter className="mr-2" size={24} />
            Session Type
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sessionTypes.map(type => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => {
                    setSessionType(type.id);
                    setFormData({...formData, mentorId: ''});
                  }}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    sessionType === type.id
                      ? 'border-purple-500 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'border-gray-200 bg-white hover:border-purple-300 text-gray-700'
                  }`}
                >
                  <Icon size={32} className="mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">{type.name}</h3>
                  <p className={`text-sm ${sessionType === type.id ? 'text-white/80' : 'text-gray-600'}`}>
                    {type.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mentor Selection (for mentoring sessions) */}
        {sessionType === 'mentoring' && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Award className="mr-2" size={24} />
              Choose Your Mentor
            </h2>
            {mentors.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <div className="text-yellow-600 mb-2">⚠️</div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Mentors Available</h3>
                <p className="text-yellow-700">
                  There are currently no mentors available for mentoring sessions. 
                  Please try selecting a different session type or contact support.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mentors.map(mentor => (
                  <button
                    key={mentor.id}
                    onClick={() => setFormData({...formData, mentorId: mentor.id})}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                      formData.mentorId === mentor.id
                        ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50'
                        : 'border-gray-200 bg-white hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center mb-4">
                      <span className="text-4xl mr-3">{mentor.image || '👤'}</span>
                      <div>
                        <h3 className="font-semibold text-gray-800">{mentor.name}</h3>
                        <p className="text-sm text-gray-600">{mentor.expertise}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-2">
                      <Star className="text-yellow-400 fill-current mr-1" size={16} />
                      <span className="text-sm font-medium">{mentor.rating || '4.8'}</span>
                      <span className="text-sm text-gray-600 ml-2">({mentor.sessions || 100} sessions)</span>
                    </div>
                    
                    <div className="space-y-1">
                      {(mentor.subjects || []).map(subject => (
                        <span key={subject} className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mr-1">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Select Date</h2>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleDateChange(-1)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => handleDateChange(1)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto mb-4">
                <Lottie animationData={scheduleAnimation} loop={true} />
              </div>
              <p className="text-lg font-medium text-gray-800">{formatDate(selectedDate)}</p>
            </div>

            {/* Time Slots */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Available Time Slots</h3>
              <div className="grid grid-cols-3 gap-2">
                {getAvailableSlots().map(time => (
                  <button
                    key={time}
                    onClick={() => handleSessionSelect(time)}
                    disabled={!isSlotAvailable(time)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedSession === time
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : isSlotAvailable(time)
                        ? 'bg-gray-100 hover:bg-purple-100 text-gray-700'
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Session Details & Booking Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {!showBookingForm ? (
              <div className="text-center py-12">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a Time Slot</h3>
                <p className="text-gray-500">Choose an available time slot to proceed with booking</p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Book Your Session</h2>
                
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session Topic *
                    </label>
                    <input
                      type="text"
                      value={formData.topic}
                      onChange={(e) => setFormData({...formData, topic: e.target.value})}
                      placeholder="What would you like to focus on?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <select
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      {sessionTypes.find(t => t.id === sessionType)?.duration.map(dur => (
                        <option key={dur} value={dur}>{dur} minutes</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Any specific requirements or topics to cover?"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Session Summary */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Session Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2 text-purple-600" />
                        {formatDate(selectedDate)}
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2 text-purple-600" />
                        {selectedSession} - {formData.duration} minutes
                      </div>
                      <div className="flex items-center">
                        <BookOpen size={16} className="mr-2 text-purple-600" />
                        {sessionTypes.find(t => t.id === sessionType)?.name}
                      </div>
                      {sessionType === 'mentoring' && formData.mentorId && (
                        <div className="flex items-center">
                          <User size={16} className="mr-2 text-purple-600" />
                          {mentors.find(m => m.id === formData.mentorId)?.name}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowBookingForm(false);
                        setBookingError('');
                      }}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || (sessionType === 'mentoring' && mentors.length > 0 && !formData.mentorId)}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Booking...
                        </>
                      ) : (
                        'Confirm Booking'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {bookingSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm mx-4 text-center">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
            <p className="text-gray-600 mb-4">
              Your session has been successfully booked and saved to Firebase.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 text-left">
              <div className="text-sm space-y-1">
                <div><strong>Date:</strong> {formatDate(selectedDate)}</div>
                <div><strong>Time:</strong> {selectedSession}</div>
                <div><strong>Duration:</strong> {formData.duration} minutes</div>
                <div><strong>Topic:</strong> {formData.topic}</div>
              </div>
            </div>
            <button 
              onClick={() => setBookingSuccess(false)}
              className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionBookingPage;