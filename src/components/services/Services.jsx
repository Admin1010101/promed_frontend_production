import React, { useState } from "react";
import { Shield, Package, Users, CheckCircle, Menu, X, Phone, Mail, MapPin, Zap, ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const Services = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const headerLinks = [
    { name: "Solutions", href: "#solutions" },
    { name: "Products", href: "#products" },
    { name: "Why ProMed", href: "#why" },
    { name: "Contact", href: "#contact" },
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
    <div className="bg-white text-gray-900 overflow-hidden">
      <section className="relative pt-32 pb-20 px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-teal-50">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Advanced Wound Care Solutions
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Trusted by <span className="text-teal-500">Providers.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                ProMed Health Plus provides advanced wound care and skin substitute solutions that help providers simplify care delivery, support proper documentation, and improve workflow efficiency.
              </p>
              <button className="bg-teal-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl">
                Contact Us for Product Details
              </button>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-teal-300 to-teal-500 rounded-3xl p-8 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop"
                  alt="Medical professional"
                  className="rounded-2xl shadow-xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Biologic Skin <span className="text-teal-500">Substitutes</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Used in clinical settings to assist in the management of chronic and complex wounds. Our biologic materials are handled and distributed under strict compliance standards to ensure product quality and traceability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl hover:bg-teal-50 transition-all group"
              >
                <CheckCircle className="text-teal-500 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" size={24} />
                <p className="text-lg text-gray-700">{feature}</p>
              </div>
            ))}
          </div>

          <div id="solutions" className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-8 text-center">Advanced Wound Care Solutions</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {solutions.map((solution, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-white/20 p-2 rounded-lg mt-1">
                    <CheckCircle size={20} />
                  </div>
                  <p className="text-lg leading-relaxed">{solution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section
        id="products"
        className="py-24 bg-gradient-to-b bg-100 transition-colors duration-500"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
            className="text-center mb-16 relative z-10"
          >
            <motion.h2
              variants={itemVariants}
              className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 relative"
            >
              Featured <span className="text-teal-600 dark:text-teal-400">Products</span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              Industry-leading skin graft solutions from trusted manufacturers
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden relative border border-gray-100 dark:border-gray-700 w-full max-w-[400px]"
                style={{ height: "500px" }}
                whileHover={{ y: -12, transition: { duration: 0.3 } }}
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
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 shadow-lg flex items-center justify-center gap-2"
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
        </div>
      </section>
      <section id="why" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Providers Choose <span className="text-teal-500">ProMed</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {whyChoose.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all group"
              >
                <div className="bg-teal-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-500 transition-colors">
                  <item.icon className="text-teal-500 group-hover:text-white transition-colors" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Get in <span className="text-teal-500">Touch</span>
            </h2>
            <p className="text-xl text-gray-600">Ready to partner with us? Our team is here to help.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              {[
                { icon: Phone, title: "Phone", info: "1-800-PROMED-1", sub: "Mon-Fri 8am-6pm EST" },
                { icon: Mail, title: "Email", info: "info@promedhealthplus.com", sub: "Response within 24 hours" },
                { icon: MapPin, title: "Location", info: "123 Medical Center Drive", sub: "Chicago, IL 60601" }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl hover:bg-teal-50 transition-all">
                  <div className="bg-teal-500 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-700 font-medium">{item.info}</p>
                    <p className="text-gray-500 text-sm">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                    placeholder="Your email"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Facility</label>
                  <input
                    type="text"
                    name="facility"
                    value={formData.facility}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                    placeholder="Your facility"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full bg-teal-500 hover:bg-teal-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-all"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;

