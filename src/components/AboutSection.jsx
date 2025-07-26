import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = () => {
  const milestones = [
    {
      year: '2024',
      title: 'CampusLink Launch',
      description: 'Officially launched across 50+ universities',
      icon: '🚀'
    },
    {
      year: '2023',
      title: 'Beta Testing',
      description: 'Successful pilot program with 1,000+ students',
      icon: '🧪'
    },
    {
      year: '2022',
      title: 'Development Started',
      description: 'Initial concept and development phase',
      icon: '💡'
    }
  ];

  const values = [
    {
      title: 'Innovation',
      description: 'Constantly evolving to meet student needs',
      icon: '⚡'
    },
    {
      title: 'Community',
      description: 'Building stronger campus connections',
      icon: '🤝'
    },
    {
      title: 'Accessibility',
      description: 'Equal access for all students',
      icon: '🌍'
    },
    {
      title: 'Excellence',
      description: 'Committed to the highest quality',
      icon: '⭐'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
      <div className="container mx-auto px-4">
        
        {/* Main About Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Revolutionizing
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Campus Life</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              CampusLink was born from the idea that campus life should be seamless, connected, and accessible. 
              We believe technology should enhance the university experience, not complicate it.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our platform brings together everything students need in one place - from academic tools to 
              social connections, from hostel services to campus announcements. We're not just building an app; 
              we're creating a digital campus ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300">
                Our Mission
              </button>
              <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300">
                Join Our Team
              </button>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="grid grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    className="text-center p-4 rounded-2xl bg-gray-50 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-3xl mb-3">{value.icon}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl"></div>
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Journey</h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From concept to campus-wide adoption, here's how we've grown to serve thousands of students.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-0.5 w-1 h-full bg-gradient-to-b from-blue-600 to-purple-600 rounded-full hidden lg:block"></div>
          
          <div className="space-y-12 lg:space-y-16">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'lg:flex-row-reverse' : ''
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex-1 bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl">{milestone.icon}</span>
                    <span className="text-2xl font-bold text-blue-600">{milestone.year}</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{milestone.title}</h4>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
                
                {/* Timeline dot */}
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full border-4 border-white shadow-lg hidden lg:block"></div>
                
                <div className="flex-1 hidden lg:block"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
