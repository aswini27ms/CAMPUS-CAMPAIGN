import React, { useState, useEffect } from 'react';
import {
  Search,
  Briefcase,
  Newspaper,
  GraduationCap,
  CalendarCheck,
  Trophy,
  Bookmark,
  BookmarkCheck,
  Plus,
  X
} from 'lucide-react';
import Lottie from 'lottie-react';
import loadingAnimation from '../assets/animations/Skills.json';
import { useAuth } from '../context/AuthContext';

const TechOpportunities = () => {
  const { currentUserType } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [savedItems, setSavedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technews',
    date: '',
    link: ''
  });

  const categories = [
    { id: 'all', name: 'All Opportunities' },
    { id: 'technews', name: 'Tech News', icon: Newspaper },
    { id: 'hackathon', name: 'Hackathons', icon: Trophy },
    { id: 'internship', name: 'Internships', icon: Briefcase },
    { id: 'scholarship', name: 'Scholarships', icon: GraduationCap },
    { id: 'workshop', name: 'Workshops', icon: CalendarCheck },
  ];

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      const sampleData = [
        {
          id: 1,
          title: 'AI Breakthrough in Medical Diagnosis',
          description: 'New AI system can detect diseases with 98% accuracy',
          category: 'technews',
          date: 'July 15, 2025',
          link: '#'
        },
        {
          id: 2,
          title: 'Google Summer Internship Program',
          description: 'Applications open for 2025 summer internships',
          category: 'internship',
          date: 'Deadline: August 30',
          link: '#'
        },
        {
          id: 3,
          title: 'National Hackathon Challenge',
          description: 'Annual coding competition with $50,000 in prizes',
          category: 'hackathon',
          date: 'September 10-12, 2025',
          link: '#'
        }
      ];
      setOpportunities(sampleData);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddOpportunity = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    const newOpportunity = {
      ...formData,
      id: Date.now()
    };

    setOpportunities(prev => [...prev, newOpportunity]);
    setShowAddForm(false);
    setFormData({
      title: '',
      description: '',
      category: 'technews',
      date: '',
      link: ''
    });
  };

  const filteredItems = opportunities.filter(item => {
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const toggleSave = (id) => {
    setSavedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Lottie animationData={loadingAnimation} className="w-40 h-40" />
        <p className="text-lg text-gray-600 mt-4">Loading Tech Feed...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Tech News & Opportunities</h1>
            <p className="text-gray-600">Stay updated with the latest in tech</p>
          </div>
          
          {currentUserType === 'admin' && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={18} />
              Add New
            </button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Add Opportunity Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Add New Tech News/Opportunity</h2>
                  <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleAddOpportunity} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        {categories.filter(c => c.id !== 'all').map(category => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="text"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        placeholder="e.g., July 20, 2025"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                    <input
                      type="url"
                      name="link"
                      value={formData.link}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add Item
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Opportunities Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => {
              const CategoryIcon = categories.find(c => c.id === item.category)?.icon || Newspaper;
              const isTechNews = item.category === 'technews';
              
              return (
                <div 
                  key={item.id} 
                  className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
                    isTechNews ? 'border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="text-blue-500" size={20} />
                        <span className="text-sm font-medium text-blue-600">
                          {categories.find(c => c.id === item.category)?.name}
                        </span>
                      </div>
                      <button 
                        onClick={() => toggleSave(item.id)}
                        className="text-gray-400 hover:text-blue-500"
                      >
                        {savedItems.includes(item.id) ? (
                          <BookmarkCheck className="text-blue-500" size={20} />
                        ) : (
                          <Bookmark size={20} />
                        )}
                      </button>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">{item.date}</span>
                      {item.link && (
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {isTechNews ? 'Read article' : 'Learn more'}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Lottie animationData={loadingAnimation} className="w-32 h-32 mx-auto opacity-50" />
            <h3 className="text-xl font-medium text-gray-700 mt-4">No items found</h3>
            <p className="text-gray-500 mt-1">
              {searchTerm ? 'Try a different search term' : 'Check back later for updates'}
            </p>
            {currentUserType === 'admin' && (
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Add New Item
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TechOpportunities;