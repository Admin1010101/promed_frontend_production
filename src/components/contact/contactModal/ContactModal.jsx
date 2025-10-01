import React, { useState, useContext, useEffect } from "react";
import { Modal, Box } from "@mui/material";
import authRequest from "../../../utils/axios";
import { AuthContext } from "../../../utils/auth";
import toast from "react-hot-toast";
import { motion } from "framer-motion"; // 💥 Import motion
import { IoCloseOutline, IoCallOutline } from "react-icons/io5";
import { AiOutlineMail } from "react-icons/ai";


// Framer Motion Variants (Copied from NewPatientForm style)
const formItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const formContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const ContactRepModal = ({ open, onClose }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const axiosInstance = authRequest();

    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/provider/contact-rep/`,
        formData
      );
      console.log("Message sent successfully:", response.data);
      toast.success("Your message has been sent to your representative.");
      setFormData({
        name: user?.full_name || "",
        phone: user?.phone_number || "",
        email: user?.email || "",
        message: "",
      });
      onClose();
    } catch (error) {
      console.error(
        "Failed to send message:",
        error.response?.data || error.message
      );
      toast.error(
        "Failed to send message. Please try again or contact support."
      );
    }
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    maxWidth: 600, // Kept max width at 600px for a good modal size
    bgcolor: "transparent",
    boxShadow: "none",
    outline: "none",
  };

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.full_name || "",
        phone: user.phone_number || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {/* 💥 Main container now uses Framer Motion for entrance/exit */}
        <motion.div
          id="contact-rep-form-wrapper"
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 mx-4 border border-gray-100 dark:border-gray-700 relative w-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          {/* Header Section (Styled like NewPatientForm header) */}
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
            <div className="flex items-center space-x-2">
              <AiOutlineMail className="h-7 w-7 text-teal-600 dark:text-teal-400" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Contact Your Rep
              </h3>
            </div>
            
            {/* Close button (Styled like NewPatientForm close button) */}
            <button
              id="close-btn"
              onClick={onClose}
              className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label="Close"
            >
              <IoCloseOutline className="h-7 w-7" />
            </button>
          </div>
          
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
            Fill out the form, and a representative will respond within 2–3 hours.
          </p>

          {/* Form container with stagger variants */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            initial="hidden"
            animate="visible"
            variants={formContainerVariants}
          >
            {/* Name */}
            <motion.div variants={formItemVariants}>
              <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition"
              />
            </motion.div>

            {/* Phone Number */}
            <motion.div variants={formItemVariants}>
              <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition"
              />
            </motion.div>

            {/* Email */}
            <motion.div variants={formItemVariants}>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition"
              />
            </motion.div>

            {/* Message */}
            <motion.div variants={formItemVariants}>
              <label htmlFor="message" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="block w-full px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm resize-none focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition"
              ></textarea>
            </motion.div>

            {/* Submit Button (Styled like NewPatientForm submit button) */}
            <motion.div className="pt-4" variants={formItemVariants}>
              <motion.button
                type="submit"
                className="w-full px-4 py-3 tracking-wide text-white font-bold transition-colors duration-200 transform bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 uppercase shadow-lg"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Message
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </Box>
    </Modal>
  );
};

export default ContactRepModal;