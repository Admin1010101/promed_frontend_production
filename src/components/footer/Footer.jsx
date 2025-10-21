import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { AiOutlineMail, AiOutlineHome, AiOutlinePhone } from "react-icons/ai";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 flex-1 px-6 mt-55 lg:mt-10">
      {/* Top Row: Socials */}
      <div className="flex flex-col lg:flex-row items-center justify-center border-b-2 border-gray-200 dark:border-gray-700 p-6 lg:justify-between">
        <div className="mb-4 lg:mb-0">
          <strong className="font-semibold uppercase text-sm">
            Connected on social media:
          </strong>
        </div>
        <div className="flex items-center justify-center">
          {/* Apply dark mode text colors to icons */}
          <a className="mr-4 text-gray-800 dark:text-gray-300 hover:text-teal-500" href="#">
            <FaFacebookF className="text-base" />
          </a>
          <a className="mr-4 text-gray-800 dark:text-gray-300 hover:text-teal-500" href="#">
            <FaLinkedinIn className="text-base" />
          </a>
          <a className="mr-4 text-gray-800 dark:text-gray-300 hover:text-teal-500" href="#">
            <FaXTwitter className="text-base" />
          </a>
          <a className="mr-4 text-gray-800 dark:text-gray-300 hover:text-teal-500" href="#">
            <FaInstagram className="text-base" />
          </a>
        </div>
      </div>

      {/* Middle Content */}
      <div className="mx-6 py-10 text-left">
        <div className="flex flex-col md:flex-row md:flex-wrap gap-10 justify-between">
          {/* Branding */}
          <div className="flex-1 min-w-[250px]">
            <div className="flex items-center mb-2">
              <img
                src={logo}
                alt="Logo"
                width={30}
                height={30}
                className="mr-1"
              />
              <h6 className="font-bold text-lg">ProMed Health <span className="text-teal-500">Plus</span></h6>
            </div>
            <p className="text-xs">
              We aim to provide advanced support by understanding the process
              and outlining the direction.
            </p>
          </div>

          {/* Useful Links */}
          <div className="flex-1 min-w-[150px]">
            <h6 className="mb-4 font-bold uppercase text-sm">Site links</h6>
            <ul className="text-xs space-y-2">
              {/* Apply dark mode text colors to links */}
              <li><Link to='/' className="text-gray-800 dark:text-gray-300 hover:text-teal-500">Home</Link></li>
              <li><Link to='/about' className="text-gray-800 dark:text-gray-300 hover:text-teal-500">About</Link></li>
              <li><Link to='/services' className="text-gray-800 dark:text-gray-300 hover:text-teal-500">Services</Link></li>
              <li><Link to='/contact' className="text-gray-800 dark:text-gray-300 hover:text-teal-500">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex-1 min-w-[250px]">
            <h6 className="mb-4 font-bold uppercase text-sm">Contact Us</h6>
            <ul className="text-xs space-y-3">
              <li className="flex items-center whitespace-nowrap">
                <AiOutlineHome className="mr-2 text-lg min-w-[1.5rem]" />
                30839 Thousand Oaks Blvd, Westlake Village, CA 91362
              </li>
              <li className="flex items-center whitespace-nowrap overflow-hidden text-ellipsis">
                <AiOutlineMail className="mr-2 text-lg min-w-[1.5rem]" />
                <span className="break-all">portal@promedhealthplus.com</span>
              </li>
              <li className="flex items-center whitespace-nowrap">
                <AiOutlinePhone className="mr-2 text-lg min-w-[1.5rem]" />
                (888)338-0490
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white dark:bg-gray-900 p-6 text-center flex flex-col md:flex-row items-center justify-center gap-1">
        <p className="text-xs font-semibold text-gray-800 dark:text-gray-300 mr-1">
          © {year} Copyright{" "}
        </p>
        <Link className="text-gray-800 dark:text-gray-300 text-xs font-semibold" to="/">
          ProMed Health <span className="text-teal-500">Plus</span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;