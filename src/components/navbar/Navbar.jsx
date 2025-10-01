import React, { useState, useEffect, useRef, useContext } from "react";
import default_user_img from "../../assets/images/default_user.jpg";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { Link } from "react-router-dom";
import { AuthContext } from "../../utils/auth";
import NotificationModal from "./NotificationModal";
import axiosAuth from "../../utils/axios";
import logo from "../../assets/images/logo.png";

const MobileMenuIconSVG = () => (
  <svg
    className="block h-4 w-4 fill-current text-teal-400"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Mobile menu</title>
    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
  </svg>
);

const CloseMenuIconSVG = () => (
  <svg
    className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    ></path>
  </svg>
);

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const notificationRef = useRef(null);

  const { user, logout, verifyToken } = useContext(AuthContext);
  const isAuthenticated = !!user && user.verified;

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    if (newMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  useEffect(() => {
    const handleResize = () => {
      // Close mobile menu when reaching lg breakpoint (1024px)
      if (window.innerWidth >= 1024) {
        closeMobileMenu();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const { success, data } = await verifyToken(
        localStorage.getItem("accessToken")
      );
      if (success) {
        setProfile(data);
      }
      setLoadingProfile(false);
    };
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, verifyToken]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const axiosInstance = axiosAuth();
        const [notifRes, countRes] = await Promise.all([
          axiosInstance.get("/provider/notifications/"),
          axiosInstance.get("/provider/notifications/unread-count/"),
        ]);

        setNotifications(notifRes.data);
        setNotificationCount(countRes.data.unread_count || 0);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  function removeDuplicateMedia(url) {
    if (url && typeof url === "string") {
      const duplicatedSegment = "media/images/";
      if (url.includes(duplicatedSegment)) {
        return url.replace(duplicatedSegment, "images/");
      }
    }
    return url;
  }

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);
    markAsRead(notification.id);
    setShowDropdown(false);
    // This is the fix: ensures the mobile menu panel is hidden before the modal appears
    closeMobileMenu();
  };

  const markAsRead = async (id) => {
    try {
      const axiosInstance = axiosAuth();
      await axiosInstance.patch(`/${id}/provider/mark-read/`);
      setNotificationCount((prev) => Math.max(prev - 1, 0));
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const axiosInstance = axiosAuth();
      await axiosInstance.delete(`/${id}/provider/delete-notification/`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setShowModal(false);
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  function getTimeLabel(dateCreated) {
    const now = new Date();
    const created = new Date(dateCreated);
    const diffTime = Math.abs(now - created);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    if (diffDays < 21) return "2 weeks ago";
    if (diffDays < 30) return "3 weeks ago";
    return "More than 30 days ago";
  }

  return (
    <div className="bg-white dark:bg-gray-900 px-6 sm:px-8 mt-2 mb-10 transition-colors duration-500">
      <nav className="relative px-4 py-4 flex justify-between items-center bg-white dark:bg-gray-900">
        {/* Logo Section */}
        <div className="flex items-center justify-center flex-shrink-0">
          <img src={logo} alt="" width={50} height={50} className="mr-1" />
          <Link
            className="text-xl sm:text-2xl lg:text-3xl font-bold leading-none text-gray-900 dark:text-gray-100 whitespace-nowrap"
            to="/"
          >
            ProMed Health <span className="text-teal-500">Plus</span>
          </Link>
        </div>

        {/* Desktop Navigation Links - Only show on lg+ screens */}
        <div className="hidden lg:flex items-center justify-center flex-1">
          <ul className="flex items-center space-x-6 xl:space-x-8">
            <li>
              <Link
                className="text-base text-gray-800 dark:text-gray-200 hover:text-teal-400 font-semibold whitespace-nowrap"
                to="/"
              >
                Home
              </Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link
                  className="text-base text-gray-800 dark:text-gray-200 hover:text-teal-400 font-semibold whitespace-nowrap"
                  to="/dashboard/"
                >
                  Dashboard
                </Link>
              </li>
            )}
            <li>
              <Link
                className="text-base text-gray-800 dark:text-gray-200 hover:text-teal-400 font-semibold whitespace-nowrap"
                to="/about/"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                className="text-base text-gray-800 dark:text-gray-200 hover:text-teal-400 font-semibold whitespace-nowrap"
                to="/products/"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                className="text-base text-gray-800 dark:text-gray-200 hover:text-teal-400 font-semibold whitespace-nowrap"
                to="/contact/"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Side Content */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile menu button - show on lg and below */}
          <div className="lg:hidden">
            <button
              className="navbar-burger flex items-center text-teal-600 p-2"
              onClick={toggleMobileMenu}
            >
              <MobileMenuIconSVG />
            </button>
          </div>

          {/* Desktop Right Side - Only show on lg+ */}
          {isAuthenticated ? (
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                aria-label="Toggle Dark Mode"
                className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition flex-shrink-0"
              >
                {isDarkMode ? (
                  <MdLightMode size={20} className="text-yellow-500" />
                ) : (
                  <MdDarkMode size={20} className="text-teal-500" />
                )}
              </button>

              <div
                className="relative notification-container flex-shrink-0"
                ref={notificationRef}
              >
                <IoIosNotificationsOutline
                  className="text-3xl text-gray-500 dark:text-gray-400 cursor-pointer font-semibold"
                  onClick={() => setShowDropdown((prev) => !prev)}
                />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">
                      Notifications
                    </div>
                    <ul className="max-h-60 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <li
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`px-4 py-2 text-xs flex flex-col ${
                              notif.is_read
                                ? "text-gray-400"
                                : "text-gray-700 dark:text-gray-300"
                            } hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer`}
                          >
                            <div className="flex justify-between items-center">
                              <span>{notif.message}</span>
                              {notif.data && (
                                <IoEyeOutline className="text-gray-400 dark:text-gray-500 text-lg ml-2" />
                              )}
                            </div>
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 italic">
                              {getTimeLabel(notif.date_created)}
                            </span>
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-2 text-[10px] text-gray-500 dark:text-gray-400 text-center">
                          No notifications
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <div
                className="relative flex-shrink-0"
                onClick={() => setShowProfileDropdown(true)}
                ref={profileRef}
              >
                <div className="flex items-center space-x-2 cursor-pointer">
                  <h6 className="text-xs font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    {profile?.full_name ||
                      profile?.user?.full_name ||
                      "Dr. Kara Johnson"}
                  </h6>
                  <img
                    src={
                      profile?.image?.startsWith("http")
                        ? removeDuplicateMedia(profile.image)
                        : profile?.image
                        ? `${process.env.REACT_APP_MEDIA_URL}${profile.image}`
                        : default_user_img
                    }
                    alt="User Profile"
                    className="w-10 h-10 rounded-full object-cover object-top border border-gray-300 shadow-sm"
                  />
                </div>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-[10px] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer uppercase font-semibold"
                    >
                      <IoEyeOutline className="mr-1" />
                      View Profile
                    </Link>
                    <Link
                      onClick={logout}
                      className="flex items-center px-4 py-2 text-[10px] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer uppercase font-semibold"
                    >
                      <IoMdLogOut className="mr-1" />
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                aria-label="Toggle Dark Mode"
                className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition flex-shrink-0"
              >
                {isDarkMode ? (
                  <MdLightMode size={20} className="text-yellow-500" />
                ) : (
                  <MdDarkMode size={20} className="text-teal-500" />
                )}
              </button>
              <Link to="/login">
                <button className="px-4 py-2 text-sm tracking-wide text-white transition-colors duration-200 transform bg-teal-500 rounded-md hover:bg-teal-400 focus:outline-none focus:bg-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 uppercase whitespace-nowrap">
                  Dashboard Login
                </button>
              </Link>
              <Link to="/register">
                <button className="px-4 py-2 text-sm tracking-wide text-teal-500 border border-teal-500 rounded-md transition-colors duration-200 hover:bg-teal-100 focus:outline-none focus:ring focus:ring-teal-500 focus:ring-opacity-50 uppercase whitespace-nowrap">
                  Provider Registration
                </button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`navbar-menu relative z-50 ${
          isMobileMenuOpen ? "" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`navbar-backdrop fixed inset-0 bg-gray-800 transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-25" : "opacity-0"
          }`}
          onClick={closeMobileMenu}
        ></div>

        {/* Sliding menu panel */}
        <nav
          className={`fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto transform transition-transform duration-300 ease-out z-50 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center mb-2 justify-between">
            <img src={logo} alt="" height={50} width={50}/>
            <Link
              className="mr-auto text-[20px] font-bold leading-none pl-[2px] text-gray-900 dark:text-gray-100"
              to="/"
            >
               ProMed Health <span className="text-teal-500">Plus</span>
            </Link>
            <button className="navbar-close" onClick={closeMobileMenu}>
              <CloseMenuIconSVG/>
            </button>
          </div>

          <ul>
            <li className="mb-1">
              <Link
                className="block px-2 py-1 text-sm font-bold text-gray-800 dark:text-gray-200 hover:bg-teal-50 dark:hover:bg-teal-800 hover:text-teal-500 rounded"
                to="/"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
            </li>
            {isAuthenticated && (
              <>
                <li className="mb-1">
                  <Link
                    className="block px-2 py-3 text-sm font-bold text-gray-800 dark:text-gray-200 hover:bg-teal-50 dark:hover:bg-teal-800 hover:text-teal-500 rounded"
                    to="/dashboard/"
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    className="block px-2 py-3 font-bold text-sm text-gray-800 dark:text-gray-200 hover:bg-teal-50 dark:hover:bg-teal-800 hover:text-teal-500 rounded"
                    to="/profile"
                    onClick={closeMobileMenu}
                  >
                    Profile
                  </Link>
                </li>
              </>
            )}
            <li className="mb-1">
              <Link
                className="block px-2 py-3 font-bold text-sm text-gray-800 dark:text-gray-200 hover:bg-teal-50 dark:hover:bg-teal-800 hover:text-teal-500 rounded"
                to="/about/"
                onClick={closeMobileMenu}
              >
                About Us
              </Link>
            </li>
            <li className="mb-1">
              <Link
                className="block px-2 py-3 font-bold text-sm text-gray-800 dark:text-gray-200 hover:bg-teal-50 dark:hover:bg-teal-800 hover:text-teal-500 rounded"
                to="/products/"
                onClick={closeMobileMenu}
              >
                Services
              </Link>
            </li>
            <li className="mb-1">
              <Link
                className="block px-2 py-3 font-bold text-sm text-gray-800 dark:text-gray-200 hover:bg-teal-50 dark:hover:bg-teal-800 hover:text-teal-500 rounded"
                to="/contact/"
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
            </li>
          </ul>
          <div className="flex items-center space-x-4 mt-4">
            <img
              src={
                profile?.image?.startsWith("http")
                  ? removeDuplicateMedia(profile.image)
                  : profile?.image
                  ? `${process.env.REACT_APP_MEDIA_URL}${profile.image}`
                  : default_user_img
              }
              alt="User Profile"
              className="w-10 h-10 rounded-full object-cover object-top border border-gray-300 shadow-sm"
            />
            <h6 className="text-[12px] font-semibold text-gray-800 dark:text-gray-200">
              {profile?.full_name ||
                profile?.user?.full_name ||
                "Dr. Kara Johnson"}
            </h6>
          </div>
          <div className="mt-auto pt-6 flex flex-col">
            {isAuthenticated ? (
              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown((prev) => !prev)}
                    className="w-full px-4 py-2 text-sm tracking-wide text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-md transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50 flex items-center justify-center"
                  >
                    <IoIosNotificationsOutline className="text-xl mr-2" />
                    Notifications
                    {notificationCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </button>
                  {showDropdown && (
                    <div className="mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                      <div className="p-3 border-b border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">
                        Notifications
                      </div>
                      <ul className="max-h-60 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <li
                              key={notif.id}
                              // The list item call remains the same, but the function it calls is now updated.
                              onClick={() => handleNotificationClick(notif)}
                              className={`px-4 py-2 text-xs flex flex-col ${
                                notif.is_read
                                  ? "text-gray-400"
                                  : "text-gray-700 dark:text-gray-300"
                              } hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer`}
                            >
                              <div className="flex justify-between items-center">
                                <span>{notif.message}</span>
                                {notif.data && (
                                  <IoEyeOutline className="text-gray-400 dark:text-gray-500 text-lg ml-2" />
                                )}
                              </div>
                              <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 italic">
                                {getTimeLabel(notif.date_created)}
                              </span>
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-2 text-[10px] text-gray-500 dark:text-gray-400 text-center">
                            No notifications
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  onClick={toggleDarkMode}
                  aria-label="Toggle Dark Mode"
                  className="w-full px-4 py-2 text-sm tracking-wide text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-md transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50 flex items-center justify-center"
                >
                  {isDarkMode ? (
                    <MdLightMode size={20} className="text-teal-500 mr-2" />
                  ) : (
                    <MdDarkMode size={20} className="text-yellow-500 mr-2" />
                  )}
                  Toggle Dark Mode
                </button>
                <button
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="w-full px-4 py-2 text-sm tracking-wide text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-md transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                <button
                  onClick={toggleDarkMode}
                  aria-label="Toggle Dark Mode"
                  className="w-full px-4 py-2 text-sm tracking-wide text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-md transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50 flex items-center justify-center"
                >
                  {isDarkMode ? (
                    <MdLightMode size={20} className="text-teal-500 mr-2" />
                  ) : (
                    <MdDarkMode size={20} className="text-yellow-500 mr-2" />
                  )}
                  Toggle Dark Mode
                </button>
                <Link to="/login" onClick={closeMobileMenu}>
                  <button className="w-full px-4 py-2 text-sm tracking-wide text-white transition-colors duration-200 transform bg-teal-500 rounded-md hover:bg-teal-400 focus:outline-none focus:bg-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 uppercase">
                    Dashboard Login
                  </button>
                </Link>
                <Link to="/register" onClick={closeMobileMenu}>
                  <button className="w-full px-4 py-2 text-sm tracking-wide text-teal-500 border border-teal-500 rounded-md transition-colors duration-200 hover:bg-teal-100 focus:outline-none focus:ring focus:ring-teal-500 focus:ring-opacity-50 uppercase">
                    Provider Registration
                  </button>
                </Link>
              </div>
            )}
          </div>

          <p className="my-4 text-xs text-center text-gray-400 dark:text-gray-500">
            ProMed Health Plus &copy; {new Date().getFullYear()}
          </p>
        </nav>
      </div>

      <NotificationModal
        open={showModal}
        handleClose={() => setShowModal(false)}
        notification={selectedNotification}
        handleDelete={deleteNotification}
      />
    </div>
  );
};

export default Navbar;
