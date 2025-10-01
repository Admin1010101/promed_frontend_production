import React from 'react';
import { motion } from 'framer-motion';
import { IoMailOutline, IoCallOutline } from 'react-icons/io5'; // Import icons for contact info

// Assuming about_team is defined elsewhere, but we'll include a placeholder structure
// const about_team = [...] 
// const itemVariants = [...] // Assuming itemVariants is the staggered entrance variant

const TeamGrid = ({ about_team, itemVariants }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {about_team.map((member, index) => (
        <motion.div
          key={member.id}
          className="perspective-1000" // Tailwind class for perspective
          variants={itemVariants}
        >
          {/* Main Flippable Container */}
          <motion.div
            className="relative h-full w-full"
            // Framer Motion properties for 3D flip on hover
            whileHover={{ rotateY: 180 }}
            transition={{ duration: 0.6 }}
            style={{ transformStyle: 'preserve-3d' }} // Required for 3D effect
          >
            {/* Front of the Card (Visible by default) */}
            <div 
              className="absolute inset-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl overflow-hidden transition-colors duration-300"
              style={{ backfaceVisibility: 'hidden' }} // Hides the back of the front card during flip
            >
              <div className="overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-3">
                  {member.title}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {member.bio}
                </p>
              </div>
            </div>

            {/* Back of the Card (Flipped over) */}
            <div
              className="absolute inset-0 bg-indigo-600 rounded-xl shadow-lg dark:shadow-2xl overflow-hidden text-white flex flex-col justify-center items-center p-6"
              style={{ 
                backfaceVisibility: 'hidden', // Hides the back of the back card
                transform: 'rotateY(180deg)' // Initially flipped to the back
              }}
            >
              <h3 className="font-extrabold text-2xl mb-4">
                Contact Info
              </h3>

              {/* Email Address */}
              <div className="flex items-center space-x-3 mb-4 text-center">
                <IoMailOutline size={24} className="flex-shrink-0" />
                <a 
                  href={`mailto:${member.email}`} 
                  className="text-lg font-light hover:underline"
                >
                  {member.email}
                </a>
              </div>

              {/* Phone Number */}
              <div className="flex items-center space-x-3 mb-4 text-center">
                <IoCallOutline size={24} className="flex-shrink-0" />
                <a 
                  href={`tel:${member.phone.replace(/[^0-9+]/g, '')}`} 
                  className="text-lg font-light hover:underline"
                >
                  {member.phone}
                </a>
              </div>
              
              <p className="mt-4 text-indigo-200 text-sm italic">
                {member.name}'s direct line
              </p>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default TeamGrid;