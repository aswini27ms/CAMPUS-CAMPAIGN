import React, { useState, useEffect } from 'react';
import { 
  BarChart3, MessageSquare, CheckCircle, ClipboardList, 
  TrendingUp, Users, Star, Loader, User, Plus, X, Trash2 
} from 'lucide-react';
import { getDatabase, ref, onValue, set, push, update } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const PollsFeedbackPage = () => {
  // State management
  const [currentUser, setCurrentUser] = useState(null);
  const [polls, setPolls] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [votedPolls, setVotedPolls] = useState({});
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState('general');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('polls');
  const [loading, setLoading] = useState(true);
  const [showAddPollModal, setShowAddPollModal] = useState(false);
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', ''],
    category: 'general'
  });

  // Categories configuration
  const categories = [
    { id: 'academic', name: 'Academic', icon: '📚', color: 'blue' },
    { id: 'events', name: 'Events', icon: '🎉', color: 'purple' },
    { id: 'facilities', name: 'Facilities', icon: '🏢', color: 'green' },
    { id: 'lifestyle', name: 'Lifestyle', icon: '🌟', color: 'orange' },
    { id: 'general', name: 'General', icon: '💬', color: 'gray' }
  ];

  // Initialize Firebase
  const auth = getAuth();
  const db = getDatabase();

  // Load data from Firebase
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        loadUserVotes(user.uid);
        loadData();
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const loadUserVotes = (userId) => {
    const userVotesRef = ref(db, `userVotes/${userId}`);
    onValue(userVotesRef, (snapshot) => {
      const votes = snapshot.val() || {};
      setVotedPolls(votes);
    });
  };

  const loadData = () => {
    setLoading(true);
    
    // Load polls
    const pollsRef = ref(db, 'polls');
    onValue(pollsRef, (snapshot) => {
      const pollsData = snapshot.val();
      if (pollsData) {
        const pollsArray = Object.keys(pollsData).map(key => ({
          id: key,
          ...pollsData[key],
          votes: pollsData[key].votes || Array(pollsData[key].options.length).fill(0),
          totalVoters: pollsData[key].totalVoters || 0
        }));
        setPolls(pollsArray);
        if (pollsArray.length > 0 && !selectedPoll) {
          setSelectedPoll(pollsArray[0]);
        }
      } else {
        setPolls([]);
      }
    });

    // Load feedback
    const feedbackRef = ref(db, 'feedback');
    onValue(feedbackRef, (snapshot) => {
      const feedbackData = snapshot.val();
      if (feedbackData) {
        const feedbackArray = Object.keys(feedbackData).map(key => ({
          id: key,
          ...feedbackData[key]
        }));
        setFeedbackList(feedbackArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } else {
        setFeedbackList([]);
      }
      setLoading(false);
    });
  };

  // Initialize with first poll selected
  useEffect(() => {
    if (polls.length > 0 && !selectedPoll) {
      setSelectedPoll(polls[0]);
    }
  }, [polls, selectedPoll]);

  // Add new poll to Firebase
  const handleAddPoll = () => {
    if (!newPoll.question.trim() || newPoll.options.some(opt => !opt.trim())) {
      alert('Please fill in all fields');
      return;
    }

    const filteredOptions = newPoll.options.filter(opt => opt.trim());
    const pollData = {
      question: newPoll.question,
      options: filteredOptions,
      category: newPoll.category,
      votes: Array(filteredOptions.length).fill(0),
      totalVoters: 0,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.uid,
      createdByName: currentUser.displayName || 'Anonymous'
    };

    const pollsRef = ref(db, 'polls');
    push(pollsRef, pollData)
      .then(() => {
        setShowAddPollModal(false);
        setNewPoll({
          question: '',
          options: ['', ''],
          category: 'general'
        });
      })
      .catch(error => {
        console.error('Error adding poll:', error);
        alert('Failed to create poll. Please try again.');
      });
  };

  const handleVote = (pollId, optionIndex) => {
    if (!currentUser || votedPolls[pollId]) return;
    
    // Update in Firebase using transaction-like pattern
    const pollRef = ref(db, `polls/${pollId}`);
    const userVoteRef = ref(db, `userVotes/${currentUser.uid}/${pollId}`);
    
    // Get current data first
    onValue(pollRef, (snapshot) => {
      const poll = snapshot.val();
      if (!poll) return;
      
      const updatedVotes = [...(poll.votes || Array(poll.options.length).fill(0))];
      updatedVotes[optionIndex] += 1;
      
      const updates = {};
      updates[`polls/${pollId}/votes`] = updatedVotes;
      updates[`polls/${pollId}/totalVoters`] = (poll.totalVoters || 0) + 1;
      updates[`userVotes/${currentUser.uid}/${pollId}`] = true;
      
      update(ref(db), updates)
        .then(() => {
          // Update local state
          setVotedPolls(prev => ({ ...prev, [pollId]: true }));
          setPolls(prev => 
            prev.map(poll => 
              poll.id === pollId 
                ? { 
                    ...poll, 
                    votes: updatedVotes,
                    totalVoters: (poll.totalVoters || 0) + 1
                  }
                : poll
            )
          );
          setSelectedPoll(prev => 
            prev?.id === pollId 
              ? { 
                  ...prev, 
                  votes: updatedVotes,
                  totalVoters: (prev.totalVoters || 0) + 1
                }
              : prev
          );
        })
        .catch(error => {
          console.error('Error updating vote:', error);
          alert('Failed to record vote. Please try again.');
        });
    }, { onlyOnce: true });
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!currentUser || !feedbackText.trim() || !feedbackTitle.trim()) return;

    const newFeedback = {
      title: feedbackTitle,
      content: feedbackText,
      category: feedbackCategory,
      rating: feedbackRating,
      author: currentUser.displayName || 'Anonymous',
      createdAt: new Date().toISOString(),
      userId: currentUser.uid,
      status: 'active'
    };

    // Save to Firebase
    const feedbackRef = ref(db, 'feedback');
    push(feedbackRef, newFeedback)
      .then(() => {
        setSubmitted(true);
        setTimeout(() => {
          setFeedbackText('');
          setFeedbackTitle('');
          setFeedbackCategory('general');
          setFeedbackRating(5);
          setSubmitted(false);
        }, 3000);
      })
      .catch(error => {
        console.error('Error submitting feedback:', error);
        alert('Failed to submit feedback. Please try again.');
      });
  };

  const renderStars = (rating, interactive = false, onRate = null) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRate && onRate(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  // Calculate stats
  const stats = {
    totalPolls: polls.length,
    totalVotes: polls.reduce((sum, poll) => sum + (poll.totalVoters || 0), 0),
    avgRating: feedbackList.length > 0 
      ? (feedbackList.reduce((sum, fb) => sum + fb.rating, 0) / feedbackList.length).toFixed(1)
      : 0,
    activePollsters: new Set(polls.map(poll => poll.createdBy)).size
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Sign In Required</h2>
          <p className="text-gray-600">Please sign in to access polls and feedback</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Student Voice Hub</h1>
            <p className="text-xl opacity-90 mb-8">
              Share your opinions and feedback to shape your campus experience
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{stats.totalPolls}</div>
                <div className="text-sm opacity-80">Active Polls</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{stats.totalVotes}</div>
                <div className="text-sm opacity-80">Total Votes</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{stats.avgRating}★</div>
                <div className="text-sm opacity-80">Avg Rating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{stats.activePollsters}</div>
                <div className="text-sm opacity-80">Participants</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-md sticky top-24">
              {/* Navigation Tabs */}
              <div className="flex flex-col space-y-2 mb-6">
                <button
                  onClick={() => setActiveTab('polls')}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === 'polls'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-medium">Live Polls</span>
                </button>
                <button
                  onClick={() => setActiveTab('feedback')}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === 'feedback'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-medium">Feedback</span>
                </button>
              </div>

              {/* Poll Selection */}
              {activeTab === 'polls' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Available Polls</h3>
                    <button 
                      onClick={() => setShowAddPollModal(true)}
                      className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                      title="Add New Poll"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {polls.length > 0 ? (
                    <div className="space-y-2">
                      {polls.map((poll) => (
                        <button
                          key={poll.id}
                          onClick={() => setSelectedPoll(poll)}
                          className={`w-full text-left p-3 rounded-xl transition-all duration-300 ${
                            selectedPoll?.id === poll.id
                              ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200'
                              : 'hover:bg-gray-50 border-2 border-transparent'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              poll.category === 'academic' ? 'bg-blue-100 text-blue-600' :
                              poll.category === 'events' ? 'bg-purple-100 text-purple-600' :
                              poll.category === 'facilities' ? 'bg-green-100 text-green-600' :
                              poll.category === 'lifestyle' ? 'bg-orange-100 text-orange-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {categories.find(cat => cat.id === poll.category)?.name}
                            </span>
                            {votedPolls[poll.id] && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <div className="text-sm font-medium text-gray-900 mb-1">{poll.question}</div>
                          <div className="text-xs text-gray-500 flex items-center space-x-2">
                            <Users className="w-3 h-3" />
                            <span>{poll.totalVoters || 0} voters</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No polls available</p>
                  )}
                </div>
              )}

              {/* Categories for Feedback */}
              {activeTab === 'feedback' && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                          feedbackCategory === category.id ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setFeedbackCategory(category.id)}
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'polls' && (
              <div className="space-y-6">
                {polls.length > 0 && selectedPoll ? (
                  <>
                    {/* Current Poll */}
                    <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl">
                            <BarChart3 className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-800">Live Poll</h2>
                            <p className="text-gray-500">Vote to see live results</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{selectedPoll.totalVoters || 0}</div>
                          <div className="text-sm text-gray-500">participants</div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <div className="flex items-center space-x-2 mb-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            selectedPoll.category === 'academic' ? 'bg-blue-100 text-blue-600' :
                            selectedPoll.category === 'events' ? 'bg-purple-100 text-purple-600' :
                            selectedPoll.category === 'facilities' ? 'bg-green-100 text-green-600' :
                            selectedPoll.category === 'lifestyle' ? 'bg-orange-100 text-orange-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {categories.find(cat => cat.id === selectedPoll.category)?.icon} {categories.find(cat => cat.id === selectedPoll.category)?.name}
                          </span>
                          <span className="text-sm text-gray-500">By {selectedPoll.createdByName}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">{selectedPoll.question}</h3>
                      </div>

                      <div className="space-y-4">
                        {selectedPoll.options.map((option, index) => {
                          const totalVotes = selectedPoll.votes.reduce((a, b) => a + b, 0);
                          const percentage = totalVotes > 0 ? ((selectedPoll.votes[index] / totalVotes) * 100).toFixed(1) : 0;
                          const hasVoted = votedPolls[selectedPoll.id];
                          return (
                            <div key={index} className="relative">
                              <button
                                onClick={() => handleVote(selectedPoll.id, index)}
                                disabled={hasVoted}
                                className={`w-full px-6 py-4 rounded-xl font-medium flex justify-between items-center transition-all duration-300 relative overflow-hidden ${
                                  hasVoted
                                    ? 'cursor-default'
                                    : 'hover:shadow-md transform hover:-translate-y-1'
                                } ${
                                  hasVoted
                                    ? 'bg-gray-50 text-gray-700 border-2 border-gray-200'
                                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-300'
                                }`}
                              >
                                <span className="relative z-10">{option}</span>
                                <span className="relative z-10 font-bold">{hasVoted ? `${percentage}%` : ''}</span>
                                {hasVoted && (
                                  <div
                                    className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 transition-all duration-1000 ease-out"
                                    style={{ width: `${percentage}%` }}
                                  />
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {votedPolls[selectedPoll.id] && (
                        <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                          <div className="flex items-center space-x-2 text-green-700">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">Thank you for voting!</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Poll Statistics */}
                    <div className="bg-white rounded-2xl p-6 shadow-md">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
                        Poll Trends
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedPoll.options.map((option, index) => {
                          const totalVotes = selectedPoll.votes.reduce((a, b) => a + b, 0);
                          const percentage = totalVotes > 0 ? ((selectedPoll.votes[index] / totalVotes) * 100).toFixed(1) : 0;
                          return (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                              <div className="text-sm font-medium text-gray-700">{option}</div>
                              <div className="text-lg font-bold text-indigo-600">{selectedPoll.votes[index]} votes</div>
                              <div className="text-xs text-gray-500">{percentage}% of total</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-2xl p-8 shadow-md text-center">
                    <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Active Polls</h3>
                    <p className="text-gray-600 mb-4">There are currently no polls available</p>
                    <button
                      onClick={() => setShowAddPollModal(true)}
                      className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                    >
                      <Plus className="w-5 h-5 inline mr-2" />
                      Create New Poll
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'feedback' && (
              <div className="space-y-6">
                {/* Feedback Form */}
                <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-green-100 to-teal-100 rounded-xl">
                      <MessageSquare className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Share Your Feedback</h2>
                      <p className="text-gray-500">Help us improve your campus experience</p>
                    </div>
                  </div>

                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Thank you for your feedback!</h3>
                      <p className="text-gray-600">Your input helps us create a better campus experience for everyone.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Feedback Title *
                          </label>
                          <input
                            type="text"
                            value={feedbackTitle}
                            onChange={(e) => setFeedbackTitle(e.target.value)}
                            placeholder="Brief title for your feedback"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                          </label>
                          <select
                            value={feedbackCategory}
                            onChange={(e) => setFeedbackCategory(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          >
                            {categories.map(category => (
                              <option key={category.id} value={category.id}>
                                {category.icon} {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Rating
                        </label>
                        {renderStars(feedbackRating, true, setFeedbackRating)}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Feedback *
                        </label>
                        <textarea
                          rows="6"
                          placeholder="Share your detailed thoughts, suggestions, or experiences..."
                          className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                      >
                        Submit Feedback ✨
                      </button>
                    </form>
                  )}
                </div>

                {/* Recent Feedback */}
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
                    Recent Community Feedback
                  </h3>
                  {feedbackList.length > 0 ? (
                    <div className="space-y-4">
                      {feedbackList.map((feedback) => (
                        <div key={feedback.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                feedback.category === 'events' ? 'bg-purple-100 text-purple-600' :
                                feedback.category === 'facilities' ? 'bg-green-100 text-green-600' :
                                feedback.category === 'lifestyle' ? 'bg-orange-100 text-orange-600' :
                                feedback.category === 'academic' ? 'bg-blue-100 text-blue-600' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {categories.find(cat => cat.id === feedback.category)?.name}
                              </span>
                              {renderStars(feedback.rating)}
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(feedback.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">{feedback.title}</h4>
                          <p className="text-gray-600 text-sm mb-2">{feedback.content}</p>
                          <p className="text-xs text-gray-500">— {feedback.author}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No feedback submitted yet. Be the first to share!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Poll Modal */}
      {showAddPollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Create New Poll</h3>
              <button 
                onClick={() => setShowAddPollModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poll Question *
                </label>
                <input
                  type="text"
                  value={newPoll.question}
                  onChange={(e) => setNewPoll({...newPoll, question: e.target.value})}
                  placeholder="Enter your poll question"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poll Options *
                </label>
                {newPoll.options.map((option, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...newPoll.options];
                        newOptions[index] = e.target.value;
                        setNewPoll({...newPoll, options: newOptions});
                      }}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                    {index > 1 && (
                      <button
                        onClick={() => {
                          const newOptions = [...newPoll.options];
                          newOptions.splice(index, 1);
                          setNewPoll({...newPoll, options: newOptions});
                        }}
                        className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setNewPoll({...newPoll, options: [...newPoll.options, '']})}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Option
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newPoll.category}
                  onChange={(e) => setNewPoll({...newPoll, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowAddPollModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPoll}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Create Poll
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PollsFeedbackPage;