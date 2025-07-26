import React from 'react';
import { motion } from 'framer-motion';

const ServicesSection = () => {
  const services = [
    {
      title: 'Academic Services',
      icon: '🎓',
      features: [
        'Course Registration',
        'Grade Tracking',
        'Assignment Submissions',
        'Exam Schedules',
        'Academic Calendar'
      ],
      color: 'blue'
    },
    {
      title: 'Campus Facilities',
      icon: '🏛️',
      features: [
        'Library Services',
        'Lab Bookings',
        'Sports Complex',
        'Cafeteria Menu',
        'Transportation'
      ],
      color: 'purple'
    },
    {
      title: 'Student Support',
      icon: '🤝',
      features: [
        'Counseling Services',
        'Health Center',
        'Financial Aid',
        'Career Guidance',
        'Technical Support'
      ],
      color: 'green'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Students' },
    { number: '50+', label: 'Campus Services' },
    { number: '24/7', label: 'Support Available' },
    { number: '99.9%', label: 'Uptime Guarantee' }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Comprehensive Campus
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From academics to daily life, we've got every aspect of your campus experience covered
            with our integrated service platform.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="relative bg-gray-50 rounded-3xl p-8 group hover:bg-white hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className={`w-20 h-20 bg-gradient-to-r ${
                service.color === 'blue' ? 'from-blue-500 to-cyan-500' :
                service.color === 'purple' ? 'from-purple-500 to-pink-500' :
                'from-green-500 to-teal-500'
              } rounded-3xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform duration-300`}>
                {service.icon}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {service.title}
              </h3>

              <ul className="space-y-4">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-600">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${
                      service.color === 'blue' ? 'from-blue-500 to-cyan-500' :
                      service.color === 'purple' ? 'from-purple-500 to-pink-500' :
                      'from-green-500 to-teal-500'
                    } mr-3`}></div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`mt-8 w-full py-3 bg-gradient-to-r ${
                service.color === 'blue' ? 'from-blue-500 to-cyan-500' :
                service.color === 'purple' ? 'from-purple-500 to-pink-500' :
                'from-green-500 to-teal-500'
              } text-white font-semibold rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0`}>
                Explore {service.title}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
