import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaTiktok } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green1 p-6">
      <div className="bg-green2 shadow-lg rounded-lg max-w-md w-full p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Contact Information
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-700">Email</h3>
            <p className="text-gray-600">exohaven.iq@gmail.com</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700">Phone</h3>
            <p className="text-gray-600">+964 783 898 4924</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700">Follow Me</h3>
            <div className="flex space-x-6 text-2xl text-gray-600">
              <a
                href="https://www.instagram.com/exohaven.iq?igsh=YXl5NzQ5Mm5keW40"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="hover:text-pink-500" />
              </a>
              <a
                href="https://www.tiktok.com/@exohaven.iq"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTiktok className="hover:text-black" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
