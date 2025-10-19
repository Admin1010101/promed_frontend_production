import React, { useState } from "react"; 
import { Shield, Package, CheckCircle, Phone, Mail, MapPin, Zap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Products = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    facility: '',
    message: ''
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const products = [
    {
      id: 1,
      title: "Allograft Skin",
      manufacturer: "TissueTech",
      description:
        "Premium human allograft skin tissue for critical wound care. Processed using advanced preservation techniques to maintain cellular integrity and promote optimal healing.",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=500&fit=crop",
    },
    {
      id: 2,
      title: "Xenograft Matrix",
      manufacturer: "BioCore",
      description:
        "Porcine-derived dermal matrix for wound coverage and tissue regeneration. Sterile, acellular scaffold that supports natural healing processes.",
      image:
        "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&h=500&fit=crop",
    },
    {
      id: 3,
      title: "Synthetic Skin Substitute",
      manufacturer: "MedTech Solutions",
      description:
        "Advanced bioengineered skin substitute with bilayer structure. Provides immediate protection while promoting dermal regeneration for burn and trauma patients.",
      image:
        "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=400&h=500&fit=crop",
    },
  ];  

  const features = [
    "Naturally derived and biocompatible materials",
    "Designed for clinical use in wound management",
    "Distributed under regulated handling procedures",
    "Available in various sizes and configurations"
  ];

  const solutions = [
    "Helps maintain a moist and protective wound setting",
    "Suitable for multiple wound care protocols",
    "Backed by reliable quality and compliance documentation",
    "Simplifies product access through our integrated provider portal"
  ];

  const whyChoose = [
    {
      icon: Shield,
      title: "Medical Director Oversight",
      description: "Every partnership and product decision is guided by clinical expertise and best practices"
    },
    {
      icon: Package,
      title: "All-in-One Portal",
      description: "Providers can manage care, documentation, and orders from a single secure platform"
    },
    {
      icon: Zap,
      title: "One-Stop Distribution",
      description: "Streamlined access to advanced biologic and wound care products, all under one compliant system"
    }
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will be in touch soon.');
    setFormData({ name: '', email: '', facility: '', message: '' });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden transition-colors duration-500 min-h-screen">
      {/* Hero Header Section */}
      <motion.header
        className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white pt-32 pb-16 transition-colors duration-500"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold"
            variants={itemVariants}
          >
            Promed Health <span className="text-teal-500">Plus</span>
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl mt-4 max-w-4xl mx-auto opacity-90 text-gray-600 dark:text-gray-300 font-semibold"
            variants={itemVariants}
          >
            Advanced Wound Care Solutions Trusted by Providers
          </motion.p>
        </div>
      </motion.header>

      {/* Main Content Container */}
      <main className="container mx-auto px-4 sm:px-6 py-16">
        
        {/* Overview Section - Card Style */}
        <motion.section
          className="mb-20 p-6 md:p-12 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-500"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              className="w-full md:w-1/2 mt-8 md:mt-0 order-1 md:order-2"
              variants={itemVariants}
            >
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop"
                alt="Medical professional"
                className="rounded-xl shadow-2xl w-full h-auto border-4 border-teal-500/50 dark:border-teal-400/50"
              />
            </motion.div>
            
            <motion.div
              className="md:w-1/2 order-2 md:order-1"
              variants={itemVariants}
            >
              <div className="inline-block bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-full text-sm font-semibold mb-6 transition-colors duration-300">
                Advanced Wound Care Solutions
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-6">
                Trusted by Providers
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
                ProMed Health Plus provides advanced wound care and skin substitute solutions that help providers simplify care delivery, support proper documentation, and improve workflow efficiency. Our commitment to excellence ensures superior patient outcomes and practice success.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Biologic Skin Substitutes Section - Card Style */}
        <motion.section
          className="mb-20 p-6 md:p-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-500"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Biologic Skin <span className="text-teal-500">Substitutes</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Used in clinical settings to assist in the management of chronic and complex wounds. Our biologic materials are handled and distributed under strict compliance standards to ensure product quality and traceability.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-start gap-4 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-teal-50 dark:hover:bg-gray-600 transition-all group border border-gray-200 dark:border-gray-600"
              >
                <CheckCircle className="text-teal-500 dark:text-teal-400 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" size={24} />
                <p className="text-base text-gray-700 dark:text-gray-300">{feature}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-teal-500 to-teal-700 dark:from-teal-600 dark:to-teal-800 rounded-2xl p-8 md:p-10 text-white transition-colors duration-300"
          >
            <h3 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Advanced Wound Care Solutions</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {solutions.map((solution, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-white/20 p-2 rounded-lg mt-1 flex-shrink-0">
                    <CheckCircle size={20} />
                  </div>
                  <p className="text-base leading-relaxed">{solution}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Featured Products Section - Card Style */}
        {/* <motion.section
          className="mb-20 p-6 md:p-12 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-500"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured <span className="text-teal-500">Products</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Industry-leading skin graft solutions from trusted manufacturers
            </p>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg overflow-hidden relative border border-gray-200 dark:border-gray-600 w-full max-w-[400px] transition-colors duration-300"
                style={{ height: "500px" }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <div className="relative h-full">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent flex flex-col justify-end p-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {product.title}
                      </h3>
                      <p className="text-sm text-teal-300 mb-4 font-semibold">
                        by {product.manufacturer}
                      </p>
                      <p className="text-gray-200 leading-relaxed mb-6 text-sm">
                        {product.description}
                      </p>
                      <motion.button
                        className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 shadow-lg flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Learn More <ArrowRight size={20} />
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section> */}

        {/* Why Choose ProMed Section - Card Style */}
        <motion.section
          className="mb-20 p-6 md:p-12 bg-teal-50 dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-500"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Providers Choose <span className="text-teal-500">ProMed</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {whyChoose.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all group border border-gray-200 dark:border-gray-600"
              >
                <div className="bg-teal-100 dark:bg-teal-900 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-500 dark:group-hover:bg-teal-600 transition-colors">
                  <item.icon className="text-teal-500 dark:text-teal-300 group-hover:text-white transition-colors" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Section - Card Style */}
        <motion.section
          className="p-6 md:p-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-500"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Get in <span className="text-teal-500">Touch</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Ready to partner with us? Our team is here to help.</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              {[
                { icon: Phone, title: "Phone", info: "1-800-PROMED-1", sub: "Mon-Fri 8am-6pm EST" },
                { icon: Mail, title: "Email", info: "info@promedhealthplus.com", sub: "Response within 24 hours" },
                { icon: MapPin, title: "Location", info: "30839 Thousand Oaks Blvd", sub: "Westlake Village, CA 91362" }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-4 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-teal-50 dark:hover:bg-gray-600 transition-all border border-gray-200 dark:border-gray-600"
                >
                  <div className="bg-teal-500 dark:bg-teal-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">{item.info}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{item.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              variants={itemVariants}
              className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-8 border border-gray-200 dark:border-gray-600 transition-colors duration-300"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Send Us a Message</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-800 outline-none transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-800 outline-none transition-all"
                    placeholder="Your email"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Facility</label>
                  <input
                    type="text"
                    name="facility"
                    value={formData.facility}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-800 outline-none transition-all"
                    placeholder="Your facility"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-800 outline-none transition-all resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white font-semibold py-4 rounded-xl shadow-lg transition-all"
                >
                  Send Message
                </button>
              </div>
            </motion.div>
          </div>
        </motion.section>

      </main>
    </div>
  );
};

export default Products;