import React, { useState } from "react";
import { Modal, Box, Typography } from "@mui/material";
import hero_img from "../../../assets/images/bg_image_01.jpg";
import hero_img_2 from "../../../assets/images/hero_img.jpg";
import wound_care_img from "../../../assets/images/woundcare_illustration.png";
import wound_care_bg from "../../../assets/images/woundcare_bg_img.jpg";
import toast from 'react-hot-toast'
import axios from "axios";
import { states } from "../../../utils/data";


const Hero = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    facility: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    question: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    // Basic Frontend Validation
    const { name, email, phone, question } = formData;
    if (!name || !email || !phone || !question) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Basic Email Format Check (a simple regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/contact-us/`,
        formData
      );

      console.log("Message sent successfully:", response.data);
      toast.success("Your message has been sent. We'll get back to you soon!");
      setOpen(false);
      setFormData({
        name: "",
        facility: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
        email: "",
        question: "",
      });
    } catch (error) {
      console.error(
        "Failed to send message:",
        error.response?.data || error.message
      );
      toast.error("Failed to send message. Please try again.");
    }
  };

  const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 600,
  maxHeight: "90vh", // 👈 Add this
  overflowY: "auto",  // 👈 Add this
  bgcolor: "transparent",
  boxShadow: "none",
  outline: "none",
};


  return (
    <>
      {/* <section className="bg-white text-gray-800 px-4 md:px-8 h-[50vh] mt-10  sm:mb-2 mb-10"> */}
      <section className="bg-white text-gray-800 px-4 md:px-8 mt-10 sm:mb-2 mb-10">
        <div className="container mx-auto flex flex-col md:flex-row lg:items-center h-[75%] justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-lg sm:text-1xl md:text-2xl lg:text-4xl font-semibold leading-tight text-center lg:text-start uppercase">
              Promed Health <span className="text-blue-500">Plus</span>
            </h1>
            <p className="mt-4 text-sm sm:text-base md:text-lg text-center lg:text-start">
              Built For The Next Generation Of Care...
            </p>

            <div className="mt-8 flex justify-center lg:justify-start">
              <button
                onClick={() => setOpen(true)}
                className="bg-white text-blue-500 font-semibold 
                 text-sm sm:text-base 
                 py-2 sm:py-3 
                 px-5 sm:px-6 
                 rounded-full shadow-lg 
                 hover:bg-blue-100 
                 transition duration-300 
                 uppercase
                 "
              >
                Contact Us
              </button>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] rounded-lg shadow-lg">
              <img
                src={wound_care_bg}
                alt="Medical professional"
                className="h-full w-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black opacity-10 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal with Tailwind Form */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 mx-4 border border-gray-100 relative h-full">
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Header */}
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
              Get In Touch
            </h2>
            <p className="text-center text-gray-500 mb-6">
              We’d love to help you. Fill out the form below and we’ll respond
              soon.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Provider Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Dr. John Smith"
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Facility Name
                </label>
                <input
                  type="text"
                  name="facility"
                  value={formData.facility}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Your clinic, hospital, or practice name"
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <div className="w-2/3">
                    <label className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="">Select</option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-1/3">
                    <label className="block text-sm font-medium text-gray-700">
                      Zip
                    </label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="(123) 456-7890"
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Your Question
                </label>
                <textarea
                  name="question"
                  value={formData.question}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Type your message..."
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default Hero;



