import React, { useState, useEffect } from 'react';
import { Search, Filter, Bell, Calendar, User, ChevronRight, Star, BookOpen } from 'lucide-react';
import Lottie from 'lottie-react';
import announcementAnimation from '../assets/animations/Annoucements.json';

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock announcements data
  const mockAnnouncements = [
    {
      id: 1,
      title: "Mid-term Examination Schedule Released",
      content: "The mid-term examination schedule for all courses has been published. Students are advised to check their timetables and prepare accordingly.",
      type: "academic",
      priority: "high",
      date: "2024-01-25",
      author: "Academic Office",
      isStarred: false,
      department: "All Departments"
    },
    {
      id: 2,
      title: "Campus Wi-Fi Maintenance",
      content: "Campus-wide Wi-Fi will undergo maintenance on Sunday, January 28th from 2:00 AM to 6:00 AM. Internet services may be interrupted during this period.",
      type: "technical",
      priority: "medium",
      date: "2024-01-24",
      author: "IT Services",
      isStarred: true,
      department: "IT Department"
    },
    {
      id: 3,
      title: "Annual Sports Day Registration Open",
      content: "Registration for Annual Sports Day 2024 is now open! Various sports events including cricket, basketball, volleyball, and athletics. Register before February 15th.",
      type: "events",
      priority: "medium",
      date: "2024-01-23",
      author: "Sports Committee",
      isStarred: false,
      department: "Sports Department"
    },
    {
      id: 4,
      title: "Hostel Fee Payment Deadline",
      content: "Reminder: Hostel fee payment deadline is January 31st, 2024. Late payments will incur additional charges. Pay online through the student portal.",
      type: "administrative",
      priority: "high",
      date: "2024-01-22",
      author: "Hostel Administration",
      isStarred: true,
      department: "Administration"
    },
    {
      id: 5,
      title: "Guest Lecture: AI in Modern Education",
      content: "Join us for an enlightening guest lecture on 'Artificial Intelligence in Modern Education' by Dr. Sarah Johnson on February 2nd, 2024 at 3:00 PM in Auditorium A.",
      type: "events",
      priority: "low",
      date: "2024-01-21",
      author: "Computer Science Department",
      isStarred: false,
      department: "CS Department"
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setAnnouncements(mockAnnouncements);
      setLoading(false);
    }, 1500);
  }, []);

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || announcement.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const toggleStar = (id) => {
    setAnnouncements(announcements.map(ann => 
      ann.id === id ? { ...ann, isStarred: !ann.isStarred } : ann
    ));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'academic': return <BookOpen size={16} />;
      case 'technical': return <User size={16} />;
      case 'events': return <Calendar size={16} />;
      case 'administrative': return <Bell size={16} />;
      default: return <Bell size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-700">Loading Announcements...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="w-64 h-64 mx-auto mb-8">
            <Lottie 
              animationData={announcementAnimation}
              loop={true} 
              className="w-full h-full"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Campus Announcements</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest news, events, and important notices from your campus
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-12 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[200px]"
              >
                <option value="all">All Categories</option>
                <option value="academic">Academic</option>
                <option value="technical">Technical</option>
                <option value="events">Events</option>
                <option value="administrative">Administrative</option>
              </select>
            </div>
          </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-6">
          {filteredAnnouncements.map((announcement) => (
            <div key={announcement.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      {getTypeIcon(announcement.type)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{announcement.title}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">{announcement.author}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{announcement.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(announcement.priority)}`}>
                      {announcement.priority.toUpperCase()}
                    </span>
                    <button
                      onClick={() => toggleStar(announcement.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        announcement.isStarred 
                          ? 'text-yellow-500 bg-yellow-50' 
                          : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                      }`}
                    >
                      <Star size={20} fill={announcement.isStarred ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 leading-relaxed mb-4">{announcement.content}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {announcement.department}
                  </span>
                  <button className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors">
                    Read More <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <div className="w-32 h-32 mx-auto mb-6 text-gray-300">
              <Bell size={128} />
            </div>
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No announcements found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementPage;
