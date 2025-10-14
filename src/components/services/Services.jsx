import React, {useState, useEffect} from 'react'
import {products} from '../../utils/data/index'

const Services = () => {
  return (
    <section>
        <div>
            <h1>COMING SOON</h1>
        </div>
    </section>
  )
}

export default Services

// import React, { useState, useEffect } from "react";
// import { motion, useScroll, useTransform } from "framer-motion";
// import {
//   Heart,
//   Shield,
//   Award,
//   Clock,
//   Users,
//   Package,
//   Phone,
//   Mail,
//   MapPin,
//   ArrowRight,
//   CheckCircle,
//   Menu,
//   X,
//   Sun, // Added Sun icon
//   Moon, // Added Moon icon
// } from "lucide-react";

// // --- Dark Mode Hook for Global State Management ---
// const useDarkMode = () => {
//     const [isDarkMode, setIsDarkMode] = useState(() => {
//         const stored = localStorage.getItem("theme");
//         if (stored) return stored === "dark";
//         return window.matchMedia('(prefers-color-scheme: dark)').matches;
//     });

//     useEffect(() => {
//         const root = window.document.documentElement;
//         if (isDarkMode) {
//             root.classList.add("dark");
//             localStorage.setItem("theme", "dark");
//         } else {
//             root.classList.remove("dark");
//             localStorage.setItem("theme", "light");
//         }
//     }, [isDarkMode]);

//     return [isDarkMode, setIsDarkMode];
// };
// // ---------------------------------------------------

// const ProMedWebsite = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useDarkMode(); // Initialize dark mode
//   const { scrollYProgress } = useScroll();
//   const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
//   const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

//   // --- Animation Variants ---
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.15,
//         delayChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
//     },
//   };

//   const fadeInUp = {
//     hidden: { opacity: 0, y: 60 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
//     },
//   };

//   // --- Data ---
//   const headerLinks = [
//     { name: "Products", href: "#products" },
//     { name: "Services", href: "#services" },
//     { name: "About", href: "#about" },
//     { name: "Contact", href: "#contact" },
//   ];

//   const products = [
//     {
//       id: 1,
//       title: "Allograft Skin",
//       manufacturer: "TissueTech",
//       description:
//         "Premium human allograft skin tissue for critical wound care. Processed using advanced preservation techniques to maintain cellular integrity and promote optimal healing.",
//       image:
//         "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=500&fit=crop",
//     },
//     {
//       id: 2,
//       title: "Xenograft Matrix",
//       manufacturer: "BioCore",
//       description:
//         "Porcine-derived dermal matrix for wound coverage and tissue regeneration. Sterile, acellular scaffold that supports natural healing processes.",
//       image:
//         "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&h=500&fit=crop",
//     },
//     {
//       id: 3,
//       title: "Synthetic Skin Substitute",
//       manufacturer: "MedTech Solutions",
//       description:
//         "Advanced bioengineered skin substitute with bilayer structure. Provides immediate protection while promoting dermal regeneration for burn and trauma patients.",
//       image:
//         "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=400&h=500&fit=crop",
//     },
//   ];

//   const stats = [
//     { icon: Users, value: "500+", label: "Medical Facilities Served" },
//     { icon: Package, value: "50K+", label: "Products Delivered" },
//     { icon: Award, value: "25+", label: "Years of Excellence" },
//     { icon: Clock, value: "24/7", label: "Emergency Support" },
//   ];

//   const services = [
//     {
//       icon: Shield,
//       title: "Quality Assurance",
//       description:
//         "Every product undergoes rigorous testing and quality control to meet the highest medical standards.",
//     },
//     {
//       icon: Clock,
//       title: "Rapid Delivery",
//       description:
//         "Temperature-controlled logistics ensure products arrive in optimal condition, when you need them.",
//     },
//     {
//       icon: Heart,
//       title: "Clinical Support",
//       description:
//         "Expert guidance and training from our dedicated clinical team to optimize patient outcomes.",
//     },
//     {
//       icon: Award,
//       title: "FDA Compliance",
//       description:
//         "All products are FDA-approved and meet stringent regulatory requirements for safety and efficacy.",
//     },
//   ];

//   const benefits = [
//     "Comprehensive product portfolio",
//     "Competitive pricing programs",
//     "Dedicated account management",
//     "24/7 emergency availability",
//     "Clinical education resources",
//     "Regulatory compliance support",
//   ];

//   return (
//     <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden transition-colors duration-500">
//       {/* --- Hero Section --- */}
//       <section
//         id="home"
//         className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
//       >
//         {/* Background Image and Overlays */}
//         <div className="absolute inset-0">
//           <img
//             src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1920&h=1080&fit=crop"
//             alt="Medical facility"
//             className="w-full h-full object-cover"
//           />
//           {/* Dark overlay with gradient - ADJUSTED FOR DARK MODE ACCENT */}
//           <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/85 to-teal-900/85 dark:from-gray-950/95 dark:via-gray-950/85 dark:to-teal-900/85"></div>
//         </div>

//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//           <motion.div
//             style={{ opacity, scale }}
//             className="text-center max-w-5xl mx-auto"
//           >
//             <motion.h1
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.7 }}
//               className="text-5xl sm:text-6xl lg:text-7xl font-semibold mb-6 leading-tight text-white drop-shadow-md"
//             >
//               Promed Health <span className="text-teal-400">Plus</span>
//             </motion.h1>
//             <motion.p
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.9 }}
//               className="text-xl sm:text-2xl text-gray-200 mb-10 leading-relaxed drop-shadow"
//             >
//               Trusted partner in wound care and tissue regeneration for medical
//               facilities nationwide
//             </motion.p>
//           </motion.div>
//         </div>

//         {/* Scroll Indicator */}
//         <motion.div
//           animate={{ y: [0, 10, 0] }}
//           transition={{ duration: 2, repeat: Infinity }}
//           className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
//         >
//           <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
//             <motion.div
//               animate={{ y: [0, 12, 0] }}
//               transition={{ duration: 1.5, repeat: Infinity }}
//               className="w-1.5 h-1.5 bg-white rounded-full mt-2"
//             />
//           </div>
//         </motion.div>
//       </section>
//       {/* --- Products Section --- */}
//       <section
//         id="products"
//         className="py-24 bg-gradient-to-b from-white dark:from-gray-900 to-gray-50 dark:to-gray-950 transition-colors duration-500"
//       >
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, amount: 0.1 }}
//             variants={containerVariants}
//             className="text-center mb-16 relative z-10"
//           >
//             <motion.h2
//               variants={itemVariants}
//               className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 relative"
//             >
//               Our <span className="text-teal-600 dark:text-teal-400">Featured Products</span>
//             </motion.h2>
//             <motion.p
//               variants={itemVariants}
//               className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
//             >
//               Industry-leading skin graft solutions from trusted manufacturers
//             </motion.p>
//           </motion.div>
//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, amount: 0.1 }}
//             variants={containerVariants}
//             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
//           >
//             {products.map((product) => (
//               <motion.div
//                 key={product.id}
//                 variants={itemVariants}
//                 className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden relative border border-gray-100 dark:border-gray-700 w-full max-w-[400px]"
//                 style={{ height: "500px" }}
//                 whileHover={{ y: -12, transition: { duration: 0.3 } }}
//               >
//                 <div className="relative h-full">
//                   <img
//                     src={product.image}
//                     alt={product.title}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent flex flex-col justify-end p-6">
//                     <motion.div
//                       initial={{ opacity: 0, y: 20 }}
//                       whileInView={{ opacity: 1, y: 0 }}
//                       transition={{ delay: 0.2 }}
//                     >
//                       <h3 className="text-2xl font-bold text-white mb-2">
//                         {product.title}
//                       </h3>
//                       <p className="text-sm text-teal-300 mb-4 font-semibold">
//                         by {product.manufacturer}
//                       </p>
//                       <p className="text-gray-200 leading-relaxed mb-6 text-sm">
//                         {product.description}
//                       </p>
//                       <motion.button
//                         className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 shadow-lg flex items-center justify-center gap-2"
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                       >
//                         Learn More <ArrowRight size={20} />
//                       </motion.button>
//                     </motion.div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* --- Services Section --- */}
//       <section id="services" className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             variants={containerVariants}
//             className="text-center mb-16"
//           >
//             <motion.h2
//               variants={fadeInUp}
//               className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4"
//             >
//               Why Choose <span className="text-teal-600 dark:text-teal-400">ProMed</span>
//             </motion.h2>
//             <motion.p
//               variants={fadeInUp}
//               className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
//             >
//               Comprehensive support for your wound care program
//             </motion.p>
//           </motion.div>

//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, amount: 0.1 }}
//             variants={containerVariants}
//             className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
//           >
//             {services.map((service, index) => (
//               <motion.div
//                 key={index}
//                 variants={itemVariants}
//                 whileHover={{ y: -8, transition: { duration: 0.3 } }}
//                 className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-teal-500/10 dark:border-teal-400/20"
//               >
//                 <motion.div
//                   whileHover={{ scale: 1.1, rotate: 5 }}
//                   className="bg-teal-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg dark:shadow-teal-700/30"
//                 >
//                   <service.icon size={32} className="text-white" />
//                 </motion.div>
//                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
//                   {service.title}
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
//                   {service.description}
//                 </p>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* --- About Section --- */}
//       <section
//         id="about"
//         className="py-24 bg-teal-600 dark:bg-gray-950 text-white transition-colors duration-500"
//       >
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             {/* Left Column (Text) */}
//             <motion.div
//               initial={{ opacity: 0, x: -50 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.8 }}
//             >
//               <h2 className="text-4xl sm:text-5xl font-bold mb-6">
//                 Dedicated to Healing Excellence
//               </h2>
//               <p className="text-xl text-teal-50 mb-8 leading-relaxed dark:text-gray-300">
//                 For over 25 years, ProMed Health Plus has been the trusted
//                 partner for medical facilities seeking premium skin graft
//                 solutions. Our commitment to quality, innovation, and
//                 exceptional service has made us a leader in wound care and
//                 tissue regeneration.
//               </p>
//               <p className="text-lg text-teal-100 mb-8 leading-relaxed dark:text-gray-400">
//                 We work exclusively with FDA-approved manufacturers who share
//                 our dedication to patient outcomes and clinical excellence.
//                 Every product in our portfolio undergoes rigorous quality
//                 control to ensure optimal safety and efficacy.
//               </p>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="bg-white text-teal-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
//               >
//                 Our Story
//               </motion.button>
//             </motion.div>

//             {/* Right Column (Benefits) */}
//             <motion.div
//               initial={{ opacity: 0, x: 50 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.8 }}
//               className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-gray-700"
//             >
//               <h3 className="text-2xl font-bold mb-6 dark:text-white">Partnership Benefits</h3>
//               <div className="space-y-4">
//                 {benefits.map((benefit, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, x: 20 }}
//                     whileInView={{ opacity: 1, x: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ delay: index * 0.1 }}
//                     className="flex items-start gap-3"
//                   >
//                     <CheckCircle
//                       size={24}
//                       className="text-teal-300 flex-shrink-0 mt-0.5"
//                     />
//                     <span className="text-lg dark:text-gray-200">{benefit}</span>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* --- Contact Section --- */}
//       <section id="contact" className="py-24 bg-white dark:bg-gray-900 transition-colors duration-500">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             variants={containerVariants}
//             className="text-center mb-16"
//           >
//             <motion.h2
//               variants={fadeInUp}
//               className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4"
//             >
//               Get in <span className="text-teal-600 dark:text-teal-400">Touch</span>
//             </motion.h2>
//             <motion.p
//               variants={fadeInUp}
//               className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
//             >
//               Ready to partner with us? Our team is here to help.
//             </motion.p>
//           </motion.div>

//           <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
//             {/* Contact Info */}
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="space-y-8"
//             >
//               {[
//                 { icon: Phone, title: "Phone", line1: "1-800-PROMED-1", line2: "Mon-Fri 8am-6pm EST" },
//                 { icon: Mail, title: "Email", line1: "info@promedhealthplus.com", line2: "We'll respond within 24 hours" },
//                 { icon: MapPin, title: "Location", line1: "123 Medical Center Drive", line2: "Chicago, IL 60601" },
//               ].map((item, index) => (
//                 <motion.div
//                   key={index}
//                   whileHover={{ x: 10 }}
//                   className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-300"
//                 >
//                   <div className="bg-teal-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
//                     <item.icon size={24} className="text-white" />
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
//                       {item.title}
//                     </h3>
//                     <p className="text-gray-600 dark:text-gray-300 text-lg">{item.line1}</p>
//                     <p className="text-gray-500 dark:text-gray-400">{item.line2}</p>
//                   </div>
//                 </motion.div>
//               ))}
//             </motion.div>

//             {/* Contact Form */}
//             <motion.form
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors duration-500 border border-gray-100 dark:border-gray-700"
//             >
//               <div className="space-y-6">
//                 {['Name', 'Email', 'Facility'].map((label) => (
//                   <div key={label}>
//                     <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">{label}</label>
//                     <input
//                       type={label === 'Email' ? 'email' : 'text'}
//                       className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-teal-600 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
//                       placeholder={`Your ${label.toLowerCase()}`}
//                     />
//                   </div>
//                 ))}
//                 <div>
//                   <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Message</label>
//                   <textarea
//                     rows="4"
//                     className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-teal-600 focus:ring-2 focus:ring-teal-200 outline-none transition-all resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
//                     placeholder="How can we help you?"
//                   ></textarea>
//                 </div>
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   type="submit"
//                   className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-300"
//                 >
//                   Send Message
//                 </motion.button>
//               </div>
//             </motion.form>
//           </div>
//         </div>
//       </section>

//       {/* --- Footer --- */}
//       <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 transition-colors duration-500">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid md:grid-cols-4 gap-8 mb-8">
//             {/* Footer Logo/Desc */}
//             <div>
//               <h3 className="text-2xl font-bold mb-4">
//                 <span className="text-teal-400">ProMed</span> Health Plus
//               </h3>
//               <p className="text-gray-400 leading-relaxed text-sm">
//                 Your trusted partner in advanced wound care and tissue
//                 regeneration solutions.
//               </p>
//             </div>
            
//             {/* Quick Links */}
//             <div>
//               <h4 className="font-bold mb-4 text-gray-200">Quick Links</h4>
//               <ul className="space-y-2 text-gray-400 text-sm">
//                 {headerLinks.map(link => (
//                     <li key={link.name}>
//                         <a href={link.href} className="hover:text-teal-400 transition-colors">{link.name}</a>
//                     </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Resources */}
//             <div>
//               <h4 className="font-bold mb-4 text-gray-200">Resources</h4>
//               <ul className="space-y-2 text-gray-400 text-sm">
//                 <li><a href="#" className="hover:text-teal-400 transition-colors">Clinical Studies</a></li>
//                 <li><a href="#" className="hover:text-teal-400 transition-colors">Training Materials</a></li>
//                 <li><a href="#" className="hover:text-teal-400 transition-colors">FAQ</a></li>
//                 <li><a href="#" className="hover:text-teal-400 transition-colors">Support</a></li>
//               </ul>
//             </div>
            
//             {/* Legal */}
//             <div>
//               <h4 className="font-bold mb-4 text-gray-200">Legal</h4>
//               <ul className="space-y-2 text-gray-400 text-sm">
//                 <li><a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a></li>
//                 <li><a href="#" className="hover:text-teal-400 transition-colors">Terms of Service</a></li>
//                 <li><a href="#" className="hover:text-teal-400 transition-colors">Compliance</a></li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
//             <p>&copy; 2025 ProMed Health Plus. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default ProMedWebsite;

