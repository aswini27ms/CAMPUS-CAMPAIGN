import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Award, 
  Users, 
  BookOpen, 
  Target, 
  CheckCircle, 
  PlayCircle,
  Clock,
  Star,
  ArrowRight,
  Building,
  Trophy,
  Zap,
  Code,
  Database,
  Shield,
  Brain,
  Smartphone,
  Globe
} from 'lucide-react';
import Lottie from 'lottie-react';
import skillsAnimation from '../assets/animations/Skills.json';

const UpskillingPage = () => {
  const [activeTab, setActiveTab] = useState('tracks');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [showAssessment, setShowAssessment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const careerTracks = [
    {
      id: 1,
      title: 'Full Stack Development',
      icon: <Code className="w-6 h-6" />,
      level: 'Beginner to Advanced',
      duration: '6 months',
      students: 1240,
      rating: 4.8,
      modules: 45,
      description: 'Master modern web development with React, Node.js, and cloud technologies.',
      skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker'],
      color: 'from-blue-500 to-cyan-500',
      progress: 65,
      nextMilestone: 'Backend Architecture'
    },
    {
      id: 2,
      title: 'Data Science & Analytics',
      icon: <Database className="w-6 h-6" />,
      level: 'Intermediate',
      duration: '8 months',
      students: 890,
      rating: 4.9,
      modules: 52,
      description: 'Learn data analysis, machine learning, and statistical modeling.',
      skills: ['Python', 'Pandas', 'TensorFlow', 'SQL', 'Tableau'],
      color: 'from-green-500 to-teal-500',
      progress: 35,
      nextMilestone: 'Machine Learning Algorithms'
    },
    {
      id: 3,
      title: 'AI & Machine Learning',
      icon: <Brain className="w-6 h-6" />,
      level: 'Advanced',
      duration: '10 months',
      students: 567,
      rating: 4.7,
      modules: 38,
      description: 'Deep dive into artificial intelligence and neural networks.',
      skills: ['PyTorch', 'OpenAI', 'Computer Vision', 'NLP', 'Deep Learning'],
      color: 'from-purple-500 to-pink-500',
      progress: 0,
      nextMilestone: 'Introduction to Neural Networks'
    },
    {
      id: 4,
      title: 'Cybersecurity',
      icon: <Shield className="w-6 h-6" />,
      level: 'Intermediate',
      duration: '7 months',
      students: 423,
      rating: 4.6,
      modules: 41,
      description: 'Protect digital assets with ethical hacking and security protocols.',
      skills: ['Penetration Testing', 'Network Security', 'CISSP', 'Firewall'],
      color: 'from-red-500 to-orange-500',
      progress: 0,
      nextMilestone: 'Network Security Fundamentals'
    },
    {
      id: 5,
      title: 'Mobile App Development',
      icon: <Smartphone className="w-6 h-6" />,
      level: 'Beginner',
      duration: '5 months',
      students: 756,
      rating: 4.5,
      modules: 32,
      description: 'Build native and cross-platform mobile applications.',
      skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
      color: 'from-indigo-500 to-blue-500',
      progress: 20,
      nextMilestone: 'React Native Basics'
    },
    {
      id: 6,
      title: 'Cloud Computing',
      icon: <Globe className="w-6 h-6" />,
      level: 'Intermediate',
      duration: '6 months',
      students: 634,
      rating: 4.7,
      modules: 36,
      description: 'Master cloud platforms and serverless architectures.',
      skills: ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Terraform'],
      color: 'from-cyan-500 to-teal-500',
      progress: 0,
      nextMilestone: 'AWS Fundamentals'
    }
  ];

  const certifications = [
    {
      id: 1,
      name: 'AWS Certified Solutions Architect',
      provider: 'Amazon Web Services',
      level: 'Professional',
      duration: '3 months',
      cost: '₹15,000',
      enrolled: 234,
      difficulty: 'Hard',
      logo: '☁️'
    },
    {
      id: 2,
      name: 'Google Data Analytics Certificate',
      provider: 'Google',
      level: 'Beginner',
      duration: '4 months',
      cost: '₹8,000',
      enrolled: 456,
      difficulty: 'Medium',
      logo: '📊'
    },
    {
      id: 3,
      name: 'Meta Front-End Developer',
      provider: 'Meta',
      level: 'Intermediate',
      duration: '5 months',
      cost: '₹12,000',
      enrolled: 789,
      difficulty: 'Medium',
      logo: '⚛️'
    }
  ];

  const industryPartners = [
    { name: 'Google', logo: '🔍', openings: 45 },
    { name: 'Microsoft', logo: '🪟', openings: 32 },
    { name: 'Amazon', logo: '📦', openings: 67 },
    { name: 'Meta', logo: '👥', openings: 23 },
    { name: 'Netflix', logo: '🎬', openings: 18 },
    { name: 'Spotify', logo: '🎵', openings: 15 }
  ];

  const achievements = [
    { id: 1, title: 'First Course Completed', icon: '🎯', unlocked: true },
    { id: 2, title: 'Code Warrior', icon: '⚔️', unlocked: true },
    { id: 3, title: 'Data Detective', icon: '🔍', unlocked: false },
    { id: 4, title: 'AI Pioneer', icon: '🤖', unlocked: false },
    { id: 5, title: 'Security Guardian', icon: '🛡️', unlocked: false },
    { id: 6, title: 'Cloud Master', icon: '☁️', unlocked: false }
  ];

  const skillAssessment = [
    { skill: 'JavaScript', level: 75, category: 'Programming' },
    { skill: 'React', level: 60, category: 'Frontend' },
    { skill: 'Node.js', level: 45, category: 'Backend' },
    { skill: 'SQL', level: 80, category: 'Database' },
    { skill: 'Git', level: 70, category: 'Tools' },
    { skill: 'AWS', level: 30, category: 'Cloud' }
  ];

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header with Lottie Animation */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <div className="w-32 h-32 mx-auto mb-4 relative">
                <Lottie 
                  animationData={skillsAnimation}
                  loop={true} 
                  className="w-full h-full"
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Upskilling Hub</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Accelerate your career with industry-aligned programs and hands-on learning experiences
            </p>
          </motion.div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 gap-4 h-full">
            {[...Array(64)].map((_, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          <div className="flex bg-white rounded-xl p-1 shadow-md">
            {[
              { id: 'tracks', label: 'Learning Tracks', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'assessment', label: 'Skill Assessment', icon: <Target className="w-4 h-4" /> },
              { id: 'certifications', label: 'Certifications', icon: <Award className="w-4 h-4" /> },
              { id: 'partnerships', label: 'Industry Partners', icon: <Building className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                    : 'text-gray-600 hover:text-teal-500'
                }`}
              >
                {tab.icon}
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div 
            className="bg-white rounded-xl p-6 text-center shadow-md"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-3xl font-bold text-teal-500 mb-2">50+</div>
            <div className="text-gray-600">Learning Tracks</div>
          </motion.div>
          <motion.div 
            className="bg-white rounded-xl p-6 text-center shadow-md"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-3xl font-bold text-cyan-500 mb-2">12K+</div>
            <div className="text-gray-600">Active Learners</div>
          </motion.div>
          <motion.div 
            className="bg-white rounded-xl p-6 text-center shadow-md"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-3xl font-bold text-green-500 mb-2">89%</div>
            <div className="text-gray-600">Job Placement</div>
          </motion.div>
          <motion.div 
            className="bg-white rounded-xl p-6 text-center shadow-md"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-3xl font-bold text-purple-500 mb-2">200+</div>
            <div className="text-gray-600">Industry Partners</div>
          </motion.div>
        </div>

        {/* Learning Tracks Tab */}
        {activeTab === 'tracks' && (
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Sidebar - Progress Dashboard */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                  Your Progress
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Progress</span>
                      <span>65%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full" style={{width: '65%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Courses Completed</span>
                      <span>12/18</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full" style={{width: '67%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Achievements</h3>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-3 rounded-xl text-center ${
                        achievement.unlocked 
                          ? 'bg-gradient-to-r from-yellow-100 to-orange-100' 
                          : 'bg-gray-100'
                      }`}
                    >
                      <div className={`text-2xl mb-1 ${achievement.unlocked ? '' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <div className={`text-xs font-medium ${
                        achievement.unlocked ? 'text-yellow-700' : 'text-gray-500'
                      }`}>
                        {achievement.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content - Career Tracks */}
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-2 gap-6">
                {careerTracks.map((track, index) => (
                  <motion.div
                    key={track.id}
                    className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-r ${track.color} rounded-xl flex items-center justify-center text-white`}>
                          {track.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{track.title}</h3>
                          <p className="text-sm text-gray-500">{track.level}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-sm font-medium">{track.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{track.description}</p>

                    {/* Progress Bar */}
                    {track.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{track.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`bg-gradient-to-r ${track.color} h-2 rounded-full`} 
                            style={{width: `${track.progress}%`}}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Next: {track.nextMilestone}</p>
                      </div>
                    )}

                    {/* Skills */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">You'll learn:</p>
                      <div className="flex flex-wrap gap-2">
                        {track.skills.map((skill, skillIndex) => (
                          <span 
                            key={skillIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{track.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        <span>{track.modules} modules</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{track.students.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button 
                        onClick={() => {
                          setSelectedTrack(track);
                          setShowEnrollModal(true);
                        }}
                        className={`flex-1 px-4 py-2 bg-gradient-to-r ${track.color} text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center`}
                      >
                        {track.progress > 0 ? 'Continue' : 'Start Learning'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                      <button className="px-4 py-2 border-2 border-gray-300 text-gray-600 font-semibold rounded-lg hover:border-teal-500 hover:text-teal-500 transition-all duration-300">
                        Preview
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Skill Assessment Tab */}
        {activeTab === 'assessment' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Skill Assessment Dashboard</h2>
                <p className="text-gray-600">Track your current skill levels and identify areas for improvement</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Current Skills</h3>
                  <div className="space-y-4">
                    {skillAssessment.map((skill, index) => (
                      <motion.div
                        key={index}
                        className="p-4 bg-gray-50 rounded-xl"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-900">{skill.skill}</span>
                          <span className="text-sm text-gray-500">{skill.category}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <motion.div 
                              className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </div>
                          <span className="text-sm font-medium text-teal-600">{skill.level}%</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Assessment Options</h3>
                  <div className="space-y-4">
                    <button 
                      onClick={() => setShowAssessment(true)}
                      className="w-full p-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Take Quick Assessment
                    </button>
                    <button className="w-full p-4 bg-white border-2 border-teal-500 text-teal-500 rounded-xl hover:bg-teal-50 transition-all duration-300 flex items-center justify-center">
                      <Target className="w-5 h-5 mr-2" />
                      Comprehensive Test
                    </button>
                    <button className="w-full p-4 bg-white border-2 border-gray-300 text-gray-600 rounded-xl hover:border-gray-400 transition-all duration-300 flex items-center justify-center">
                      <PlayCircle className="w-5 h-5 mr-2" />
                      Practice Questions
                    </button>
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                    <h4 className="font-bold text-gray-900 mb-3">📈 Recommendations</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• Focus on AWS skills for cloud development</li>
                      <li>• Improve Node.js for backend projects</li>
                      <li>• Consider Data Science track based on SQL strength</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Certifications Tab */}
        {activeTab === 'certifications' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.id}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3">{cert.logo}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{cert.name}</h3>
                  <p className="text-sm text-gray-500">{cert.provider}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Level:</span>
                    <span className="font-medium">{cert.level}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{cert.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cost:</span>
                    <span className="font-medium text-green-600">{cert.cost}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Difficulty:</span>
                    <span className={`font-medium ${
                      cert.difficulty === 'Hard' ? 'text-red-500' : 
                      cert.difficulty === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {cert.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Enrolled:</span>
                    <span className="font-medium">{cert.enrolled} students</span>
                  </div>
                </div>

                <button className="w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300">
                  Enroll Now
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Industry Partners Tab */}
        {activeTab === 'partnerships' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Industry Partners</h2>
              <p className="text-gray-600">Get direct placement opportunities with top tech companies</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {industryPartners.map((partner, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-4xl mb-4">{partner.logo}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{partner.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{partner.openings} open positions</p>
                  <button className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all duration-300">
                    View Jobs
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Placement Success Stories</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-teal-500 mb-2">89%</div>
                  <div className="text-gray-600">Placement Rate</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-cyan-500 mb-2">₹8.5L</div>
                  <div className="text-gray-600">Average Package</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-green-500 mb-2">2.3K+</div>
                  <div className="text-gray-600">Students Placed</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enrollment Modal */}
      {showEnrollModal && selectedTrack && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-2xl p-8 max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-6">
              <div className={`w-16 h-16 bg-gradient-to-r ${selectedTrack.color} rounded-xl flex items-center justify-center text-white mx-auto mb-4`}>
                {selectedTrack.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedTrack.title}</h3>
              <p className="text-gray-600">{selectedTrack.description}</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{selectedTrack.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Level:</span>
                <span className="font-medium">{selectedTrack.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Modules:</span>
                <span className="font-medium">{selectedTrack.modules} modules</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Students:</span>
                <span className="font-medium">{selectedTrack.students.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowEnrollModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-600 font-semibold rounded-xl hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowEnrollModal(false)}
                className={`flex-1 px-6 py-3 bg-gradient-to-r ${selectedTrack.color} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300`}
              >
                {selectedTrack.progress > 0 ? 'Continue Learning' : 'Start Course'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Assessment Modal */}
      {showAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-2xl p-8 max-w-lg w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Skill Assessment</h3>
            
            <div className="space-y-4 mb-6">
              <p className="text-gray-600">This quick assessment will help us understand your current skill level and recommend the best learning path for you.</p>
              
              <div className="bg-teal-50 p-4 rounded-xl">
                <h4 className="font-semibold text-teal-800 mb-2">Assessment includes:</h4>
                <ul className="text-sm text-teal-700 space-y-1">
                  <li>• 15 technical questions</li>
                  <li>• 5 minutes completion time</li>
                  <li>• Personalized recommendations</li>
                  <li>• Learning path suggestions</li>
                </ul>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowAssessment(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-600 font-semibold rounded-xl hover:border-gray-400 transition-colors"
              >
                Maybe Later
              </button>
              <button
                onClick={() => setShowAssessment(false)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Start Assessment
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UpskillingPage;
