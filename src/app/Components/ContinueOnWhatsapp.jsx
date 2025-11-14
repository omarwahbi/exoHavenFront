import React from "react";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion } from "framer-motion";

const ContinueOnWhatsApp = ({ messageText, totalPrice = 0, onValidate }) => {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+9647838984924";

  const formatMessageForWhatsApp = (text) => {
    // Replace newlines with URL-encoded newlines and encode the entire message
    return encodeURIComponent(`${text}\n`);
  };

  const handleContinueOnWhatsApp = () => {
    // Run validation check if provided
    if (onValidate && !onValidate()) {
      return; // Stop if validation fails
    }

    const formattedMessage = formatMessageForWhatsApp(messageText);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${formattedMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappURL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative">
      {/* Gradient border effect using pseudo-element */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green4 to-green5 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      
      <motion.button
        onClick={handleContinueOnWhatsApp}
        className="relative w-full flex items-center justify-center gap-2 bg-green4 hover:bg-green5 text-white font-medium py-3.5 px-5 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md group"
        whileHover={{ 
          scale: 1.01,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <WhatsAppIcon className="text-white" fontSize="medium" />
            <span className="text-base">إتمام الطلب عبر واتساب</span>
          </div>
          <div className="bg-white bg-opacity-20 p-1 rounded-full rotate-180">
            <ArrowForwardIcon className="text-white" fontSize="small" />
          </div>
        </div>
      </motion.button>
    </div>
  );
};

export default ContinueOnWhatsApp;
