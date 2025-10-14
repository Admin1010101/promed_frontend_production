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
// } from "lucide-react";

// const ProMedWebsite = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [activeSection, setActiveSection] = useState("home");
//   const { scrollYProgress } = useScroll();
//   const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
//   const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

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
//     <div className="bg-white text-gray-900 overflow-hidden">
//       {/* Hero Section */}
//       <section
//         id="home"
//         className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
//       >
//         {/* Background Image */}
//         <div className="absolute inset-0">
//           <img
//             src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1920&h=1080&fit=crop"
//             alt="Medical facility"
//             className="w-full h-full object-cover"
//           />
//           {/* Dark overlay with gradient */}
//           <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/80 to-teal-900/80"></div>

//           {/* Animated gradient overlay */}
//           <motion.div
//             className="absolute inset-0"
//             animate={{
//               backgroundPosition: ["0% 0%", "100% 100%"],
//             }}
//             transition={{
//               duration: 20,
//               repeat: Infinity,
//               repeatType: "reverse",
//             }}
//             style={{
//               backgroundImage:
//                 "radial-gradient(circle at 20% 50%, rgba(20, 184, 166, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)",
//               backgroundSize: "100% 100%",
//             }}
//           />
//         </div>

//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//           <motion.div
//             style={{ opacity, scale }}
//             className="text-center max-w-5xl mx-auto"
//           >
//             <motion.h1
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.2 }}
//               className="text-5xl sm:text-6xl lg:text-7xl font-semibold mb-6 leading-tight text-white"
//             >
//               Promed Health <span className="text-teal-400">Plus</span>
//             </motion.h1>
//             <motion.p
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.4 }}
//               className="text-xl sm:text-2xl text-gray-200 mb-10 leading-relaxed"
//             >
//               Trusted partner in wound care and tissue regeneration for medical
//               facilities nationwide
//             </motion.p>
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.6 }}
//               className="flex flex-col sm:flex-row gap-4 justify-center"
//             >
//               <motion.button
//                 whileHover={{
//                   scale: 1.05,
//                   boxShadow: "0 20px 40px rgba(20, 184, 166, 0.3)",
//                 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300"
//               >
//                 Explore Products
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="bg-white hover:bg-gray-50 text-teal-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg border-2 border-teal-600 transition-all duration-300"
//               >
//                 Contact Us
//               </motion.button>
//             </motion.div>
//           </motion.div>
//         </div>

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

//       {/* Stats Section */}
//       <section className="py-20 bg-teal-600 text-white">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, amount: 0.3 }}
//             variants={containerVariants}
//             className="grid grid-cols-2 lg:grid-cols-4 gap-8"
//           >
//             {stats.map((stat, index) => (
//               <motion.div
//                 key={index}
//                 variants={itemVariants}
//                 className="text-center"
//               >
//                 <motion.div
//                   whileHover={{ scale: 1.1, rotate: 5 }}
//                   className="inline-block mb-4"
//                 >
//                   <stat.icon size={48} className="mx-auto" />
//                 </motion.div>
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.5 }}
//                   whileInView={{ opacity: 1, scale: 1 }}
//                   viewport={{ once: true }}
//                   transition={{ duration: 0.5, delay: index * 0.1 }}
//                   className="text-4xl font-bold mb-2"
//                 >
//                   {stat.value}
//                 </motion.div>
//                 <div className="text-teal-100 font-medium">{stat.label}</div>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* Products Section */}
//       <section
//         id="products"
//         className="py-24 bg-gradient-to-b from-gray-50 to-white"
//       >
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, amount: 0.1 }}
//             variants={containerVariants}
//             className="text-center mb-16"
//           >
//             <motion.h2
//               variants={itemVariants}
//               className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4"
//             >
//               Our <span className="text-teal-600">Product Line</span>
//             </motion.h2>
//             <motion.p
//               variants={itemVariants}
//               className="text-xl text-gray-600 max-w-3xl mx-auto"
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
//                 className="bg-white rounded-2xl shadow-xl overflow-hidden relative border border-gray-100 w-full max-w-[400px]"
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

//       {/* Services Section */}
//       <section id="services" className="py-24 bg-white">
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
//               className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4"
//             >
//               Why Choose <span className="text-teal-600">ProMed</span>
//             </motion.h2>
//             <motion.p
//               variants={fadeInUp}
//               className="text-xl text-gray-600 max-w-3xl mx-auto"
//             >
//               Comprehensive support for your wound care program
//             </motion.p>
//           </motion.div>

//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, amount: 0.1 }}
//             variants={containerVariants}
//             className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center"
//           >
//             {services.map((service, index) => (
//               <motion.div
//                 key={index}
//                 variants={itemVariants}
//                 whileHover={{ y: -8, transition: { duration: 0.3 } }}
//                 className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
//               >
//                 <motion.div
//                   whileHover={{ scale: 1.1, rotate: 5 }}
//                   className="bg-teal-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg"
//                 >
//                   <service.icon size={32} className="text-white" />
//                 </motion.div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-3">
//                   {service.title}
//                 </h3>
//                 <p className="text-gray-600 leading-relaxed">
//                   {service.description}
//                 </p>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* About Section */}
//       <section
//         id="about"
//         className="py-24 bg-gradient-to-br from-teal-600 to-blue-600 text-white"
//       >
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <motion.div
//               initial={{ opacity: 0, x: -50 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.8 }}
//             >
//               <h2 className="text-4xl sm:text-5xl font-bold mb-6">
//                 Dedicated to Healing Excellence
//               </h2>
//               <p className="text-xl text-teal-50 mb-8 leading-relaxed">
//                 For over 25 years, ProMed Health Plus has been the trusted
//                 partner for medical facilities seeking premium skin graft
//                 solutions. Our commitment to quality, innovation, and
//                 exceptional service has made us a leader in wound care and
//                 tissue regeneration.
//               </p>
//               <p className="text-lg text-teal-100 mb-8 leading-relaxed">
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

//             <motion.div
//               initial={{ opacity: 0, x: 50 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.8 }}
//               className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
//             >
//               <h3 className="text-2xl font-bold mb-6">Partnership Benefits</h3>
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
//                     <span className="text-lg">{benefit}</span>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Contact Section */}
//       <section id="contact" className="py-24 bg-gray-50">
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
//               className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4"
//             >
//               Get in <span className="text-teal-600">Touch</span>
//             </motion.h2>
//             <motion.p
//               variants={fadeInUp}
//               className="text-xl text-gray-600 max-w-3xl mx-auto"
//             >
//               Ready to partner with us? Our team is here to help.
//             </motion.p>
//           </motion.div>

//           <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="space-y-8"
//             >
//               <motion.div
//                 whileHover={{ x: 10 }}
//                 className="flex items-start gap-4"
//               >
//                 <div className="bg-teal-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
//                   <Phone size={24} className="text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold text-gray-900 mb-2">
//                     Phone
//                   </h3>
//                   <p className="text-gray-600 text-lg">1-800-PROMED-1</p>
//                   <p className="text-gray-500">Mon-Fri 8am-6pm EST</p>
//                 </div>
//               </motion.div>

//               <motion.div
//                 whileHover={{ x: 10 }}
//                 className="flex items-start gap-4"
//               >
//                 <div className="bg-teal-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
//                   <Mail size={24} className="text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold text-gray-900 mb-2">
//                     Email
//                   </h3>
//                   <p className="text-gray-600 text-lg">
//                     info@promedhealthplus.com
//                   </p>
//                   <p className="text-gray-500">We'll respond within 24 hours</p>
//                 </div>
//               </motion.div>

//               <motion.div
//                 whileHover={{ x: 10 }}
//                 className="flex items-start gap-4"
//               >
//                 <div className="bg-teal-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
//                   <MapPin size={24} className="text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold text-gray-900 mb-2">
//                     Location
//                   </h3>
//                   <p className="text-gray-600 text-lg">
//                     123 Medical Center Drive
//                   </p>
//                   <p className="text-gray-500">Chicago, IL 60601</p>
//                 </div>
//               </motion.div>
//             </motion.div>

//             <motion.form
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="bg-white rounded-2xl shadow-xl p-8"
//             >
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-2">
//                     Name
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
//                     placeholder="Your name"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-2">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
//                     placeholder="your@email.com"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-2">
//                     Facility
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
//                     placeholder="Hospital or clinic name"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 font-semibold mb-2">
//                     Message
//                   </label>
//                   <textarea
//                     rows="4"
//                     className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-200 outline-none transition-all resize-none"
//                     placeholder="How can we help you?"
//                   ></textarea>
//                 </div>
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   type="submit"
//                   className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-300"
//                 >
//                   Send Message
//                 </motion.button>
//               </div>
//             </motion.form>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-12">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid md:grid-cols-4 gap-8 mb-8">
//             <div>
//               <h3 className="text-2xl font-bold mb-4">
//                 <span className="text-teal-400">ProMed</span> Health Plus
//               </h3>
//               <p className="text-gray-400 leading-relaxed">
//                 Your trusted partner in advanced wound care and tissue
//                 regeneration solutions.
//               </p>
//             </div>
//             <div>
//               <h4 className="font-bold mb-4">Quick Links</h4>
//               <ul className="space-y-2 text-gray-400">
//                 <li>
//                   <a
//                     href="#home"
//                     className="hover:text-teal-400 transition-colors"
//                   >
//                     Home
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#products"
//                     className="hover:text-teal-400 transition-colors"
//                   >
//                     Products
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#services"
//                     className="hover:text-teal-400 transition-colors"
//                   >
//                     Services
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#about"
//                     className="hover:text-teal-400 transition-colors"
//                   >
//                     About
//                   </a>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-bold mb-4">Resources</h4>
//               <ul className="space-y-2 text-gray-400">
//                 <li>
//                   <a href="#" className="hover:text-teal-400 transition-colors">
//                     Clinical Studies
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-teal-400 transition-colors">
//                     Training Materials
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-teal-400 transition-colors">
//                     FAQ
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-teal-400 transition-colors">
//                     Support
//                   </a>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-bold mb-4">Legal</h4>
//               <ul className="space-y-2 text-gray-400">
//                 <li>
//                   <a href="#" className="hover:text-teal-400 transition-colors">
//                     Privacy Policy
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-teal-400 transition-colors">
//                     Terms of Service
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="hover:text-teal-400 transition-colors">
//                     Compliance
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
//             <p>&copy; 2025 ProMed Health Plus. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default ProMedWebsite;

