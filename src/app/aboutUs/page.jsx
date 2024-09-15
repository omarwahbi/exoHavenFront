import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 p-6">
      <div className="bg-green-200 shadow-lg rounded-lg max-w-2xl w-full p-8 space-y-6">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          About Exohaven
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          At Exohaven, we are passionate about bringing you the finest exotic
          animals and specialized accessories for lizards and other reptiles.
          Our goal is to create a sanctuary for reptile enthusiasts, offering
          everything you need to care for your unique pets. With expert advice
          and high-quality products, we strive to help you build the perfect
          haven for your exotic companions.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          Whether you&apos;re new to the reptile world or a seasoned keeper,
          Exohaven is your trusted partner. From habitat setups to nutrition, we
          ensure that your reptiles get the best care possible. Join us on this
          exciting journey, and let&apos;s create the ultimate environment for
          your fascinating pets.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
