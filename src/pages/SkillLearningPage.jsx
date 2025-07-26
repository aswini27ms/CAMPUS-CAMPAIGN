import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  PlayCircle, 
  Clock, 
  Users, 
  Star, 
  Trophy, 
  TrendingUp,
  Code,
  Palette,
  BarChart3,
  Lightbulb,
  Globe,
  Zap,
  CheckCircle,
  Award,
  Target
} from 'lucide-react';

const SkillLearningPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [enrolling, setEnrolling] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [userEmail] = useState('student@university.edu');

  const categories = [
    { id: 'all', name: 'All Courses', icon: Globe, color: 'from-gray-500 to-gray-600' },
    { id: 'programming', name: 'Programming', icon: Code, color: 'from-teal-500 to-cyan-500' },
    { id: 'design', name: 'Design', icon: Palette, color: 'from-purple-500 to-pink-500' },
    { id: 'business', name: 'Business', icon: BarChart3, color: 'from-teal-500 to-cyan-500' },
    { id: 'innovation', name: 'Innovation', icon: Lightbulb, color: 'from-cyan-500 to-teal-500' },
    { id: 'productivity', name: 'Productivity', icon: Zap, color: 'from-teal-500 to-cyan-500' }
  ];

  const coursesData = [
    {
      id: 1,
      title: 'Full Stack Web Development',
      description: 'Master modern web development with React, Node.js, and MongoDB. Build real-world applications from scratch.',
      category: 'programming',
      instructor: 'Dr. Sarah Johnson',
      duration: '12 weeks',
      students: 1250,
      rating: 4.8,
      image: '💻',
      lessons: 45,
      difficulty: 'Intermediate',
      price: '₹4,999',
      tags: ['React', 'Node.js', 'MongoDB', 'JavaScript']
    },
    {
      id: 2,
      title: 'UI/UX Design Fundamentals',
      description: 'Learn design thinking, prototyping, and user experience principles. Create stunning user interfaces.',
      category: 'design',
      instructor: 'Prof. Michael Chen',
      duration: '8 weeks',
      students: 890,
      rating: 4.9,
      image: '🎨',
      lessons: 32,
      difficulty: 'Beginner',
      price: '₹3,499',
      tags: ['Figma', 'Adobe XD', 'Design Systems', 'Prototyping']
    },
    {
      id: 3,
      title: 'Digital Marketing Strategy',
      description: 'Build effective marketing campaigns for the digital age. Master SEO, social media, and analytics.',
      category: 'business',
      instructor: 'Ms. Emily Rodriguez',
      duration: '6 weeks',
      students: 2100,
      rating: 4.7,
      image: '📈',
      lessons: 24,
      difficulty: 'Beginner',
      price: '₹2,999',
      tags: ['SEO', 'Social Media', 'Analytics', 'Content Marketing']
    },
    {
      id: 4,
      title: 'Data Science with Python',
      description: 'Analyze data and build machine learning models. Master pandas, numpy, and scikit-learn.',
      category: 'programming',
      instructor: 'Dr. James Wilson',
      duration: '16 weeks',
      students: 1680,
      rating: 4.6,
      image: '🐍',
      lessons: 60,
      difficulty: 'Advanced',
      price: '₹6,999',
      tags: ['Python', 'Machine Learning', 'Pandas', 'NumPy']
    },
    {
      id: 5,
      title: 'Creative Problem Solving',
      description: 'Develop innovative thinking and solution design skills. Learn creative methodologies and frameworks.',
      category: 'innovation',
      instructor: 'Prof. Lisa Thompson',
      duration: '4 weeks',
      students: 750,
      rating: 4.8,
      image: '💡',
      lessons: 16,
      difficulty: 'Intermediate',
      price: '₹1,999',
      tags: ['Design Thinking', 'Innovation', 'Problem Solving', 'Creativity']
    },
    {
      id: 6,
      title: 'Time Management Mastery',
      description: 'Boost productivity and manage your time effectively. Learn proven techniques and tools.',
      category: 'productivity',
      instructor: 'Mr. David Kim',
      duration: '3 weeks',
      students: 3200,
      rating: 4.5,
      image: '⏰',
      lessons: 12,
      difficulty: 'Beginner',
      price: '₹1,499',
      tags: ['Productivity', 'Time Management', 'Goal Setting', 'Habits']
    }
  ];

  const fetchCourses = async () => {
    try {
      setAllCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setAllCourses(coursesData);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const sampleEnrollments = [
        { courseId: 1, progress: 65, enrolledAt: new Date('2024-01-15'), lastAccessed: new Date('2024-01-20') },
        { courseId: 3, progress: 30, enrolledAt: new Date('2024-01-10'), lastAccessed: new Date('2024-01-22') },
        { courseId: 5, progress: 80, enrolledAt: new Date('2024-01-05'), lastAccessed: new Date('2024-01-21') }
      ];
      
      const enrolledCoursesWithProgress = sampleEnrollments.map(enrollment => {
        const course = allCourses.find(c => c.id === enrollment.courseId);
        return course ? {
          ...course,
          ...enrollment,
          enrolled: true
        } : null;
      }).filter(Boolean);
      
      setEnrolledCourses(enrolledCoursesWithProgress);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchCourses();
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    };
    loadData();
  }, [userEmail]);

  useEffect(() => {
    if (allCourses.length > 0) {
      fetchEnrollments();
    }
  }, [allCourses]);

  const handleEnrollment = async (courseId) => {
    setEnrolling(prev => ({ ...prev, [courseId]: true }));
    
    try {
      const course = allCourses.find(c => c.id === courseId);
      
      // Simulate enrollment process
      setTimeout(() => {
        const newEnrollment = {
          ...course,
          progress: 0,
          enrolledAt: new Date(),
          lastAccessed: new Date(),
          enrolled: true,
          enrollmentId: `enrollment_${courseId}`
        };
        
        setEnrolledCourses(prev => [...prev, newEnrollment]);
        
        setSuccessMessage(`Successfully enrolled in "${course.title}"!`);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        
        setEnrolling(prev => ({ ...prev, [courseId]: false }));
      }, 2000);
      
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Error enrolling in course. Please try again.');
      setEnrolling(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const continueLearning = (courseId) => {
    const course = enrolledCourses.find(c => c.id === courseId);
    alert(`Continuing "${course.title}"... (Navigate to course content)`);
  };

  const filteredCourses = allCourses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Intermediate': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'Advanced': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isEnrolled = (courseId) => {
    return enrolledCourses.some(course => course.id === courseId);
  };

  const getEnrolledCourse = (courseId) => {
    return enrolledCourses.find(course => course.id === courseId);
  };

  const stats = {
    totalCourses: allCourses.length,
    enrolledCount: enrolledCourses.length,
    averageProgress: enrolledCourses.length > 0 ? 
      Math.round(enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length) : 0,
    completedCourses: enrolledCourses.filter(course => course.progress === 100).length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Learning Platform...</h2>
          <p className="text-gray-600">Preparing your personalized experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center relative z-10">
            <div className="w-32 h-32 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <BookOpen className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Skill Learning Hub
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              🚀 Enhance your skills with expert-led courses and hands-on projects
            </p>
            
            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { label: 'Available Courses', value: stats.totalCourses, icon: BookOpen, color: 'from-white/20 to-white/30' },
                { label: 'Your Enrollments', value: stats.enrolledCount, icon: Trophy, color: 'from-white/20 to-white/30' },
                { label: 'Avg Progress', value: `${stats.averageProgress}%`, icon: Target, color: 'from-white/20 to-white/30' },
                { label: 'Completed', value: stats.completedCourses, icon: Award, color: 'from-white/20 to-white/30' }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-white/20 flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 gap-4 h-full">
            {[...Array(64)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-full w-2 h-2 animate-pulse"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-md border p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search courses, skills, or instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-200 focus:border-teal-400 transition-all duration-300 bg-gray-50 text-lg"
              />
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Currently browsing</div>
              <div className="font-bold text-teal-600 text-lg">
                {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        {enrolledCourses.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-md border p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Trophy className="mr-3 text-teal-500" size={28} />
                Your Learning Journey
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map(course => (
                  <div key={course.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl">{course.image}</span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-teal-600">{course.progress}%</div>
                        <div className="text-xs text-gray-500">Complete</div>
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-3 text-lg leading-tight">{course.title}</h3>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div 
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 h-3 rounded-full transition-all duration-700"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <PlayCircle size={16} className="mr-2" />
                        {Math.floor((course.progress / 100) * course.lessons)} of {course.lessons} lessons
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2" />
                        {course.duration}
                      </div>
                    </div>
                    <button
                      onClick={() => continueLearning(course.id)}
                      className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center hover:shadow-lg"
                    >
                      <PlayCircle size={18} className="mr-2" />
                      Continue Learning
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-md border p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Filter className="mr-3" size={24} />
              Course Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map(category => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`group flex flex-col items-center p-6 rounded-2xl transition-all duration-300 border-2 ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg border-transparent transform scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-teal-300 hover:shadow-md'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 ${
                      selectedCategory === category.id 
                        ? 'bg-white/20' 
                        : `bg-gradient-to-r ${category.color} text-white`
                    }`}>
                      <Icon size={20} />
                    </div>
                    <span className="font-semibold text-sm text-center leading-tight">{category.name}</span>
                    <span className="text-xs mt-1 opacity-75">
                      {allCourses.filter(c => category.id === 'all' || c.category === category.id).length} courses
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => {
            const enrolled = isEnrolled(course.id);
            const enrolledCourse = enrolled ? getEnrolledCourse(course.id) : null;
            
            return (
              <div key={course.id} className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border hover:transform hover:scale-105">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                      {course.image}
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${getDifficultyColor(course.difficulty)}`}>
                        {course.difficulty}
                      </span>
                      <div className="text-lg font-bold text-teal-600 mt-1">{course.price}</div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight group-hover:text-teal-600 transition-colors duration-300">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{course.description}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-teal-50 text-teal-700 rounded-lg text-xs font-medium border border-teal-100">
                        {tag}
                      </span>
                    ))}
                    {course.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium border border-gray-200">
                        +{course.tags.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                      <BookOpen size={16} className="mr-2 text-gray-400" />
                      <span>{course.lessons} lessons</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                      <Clock size={16} className="mr-2 text-gray-400" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                      <Users size={16} className="mr-2 text-gray-400" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                      <Star size={16} className="mr-2 text-yellow-400 fill-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                        {course.instructor.split(' ').map(n => n[0]).join('')}
                      </span>
                      <span>Instructor: <span className="font-semibold">{course.instructor}</span></span>
                    </p>
                    
                    {enrolled ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600 font-medium">Progress</span>
                          <span className="font-bold text-teal-600">{enrolledCourse.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-teal-500 to-cyan-500 h-3 rounded-full transition-all duration-700"
                            style={{ width: `${enrolledCourse.progress}%` }}
                          />
                        </div>
                        <button 
                          onClick={() => continueLearning(course.id)}
                          className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center hover:shadow-lg transform hover:scale-105"
                        >
                          <PlayCircle size={18} className="mr-2" />
                          Continue Learning
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleEnrollment(course.id)}
                        disabled={enrolling[course.id]}
                        className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center hover:shadow-lg transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {enrolling[course.id] ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            Enrolling...
                          </>
                        ) : (
                          <>
                            <TrendingUp size={18} className="mr-2" />
                            Enroll Now
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
              <BookOpen size={64} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-500 mb-3">No courses found</h3>
            <p className="text-gray-400 text-lg">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl border transform transition-all duration-300">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Enrollment Successful! 🎉
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              {successMessage}
            </p>
            <div className="text-sm text-teal-600 font-medium">
              You can now start learning immediately!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillLearningPage;