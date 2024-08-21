"use client";
import { useState, useEffect } from "react";

const Slider = () => {
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("http://localhost:1337/api/carousels");
        const data = await response.json();
        setImages(data.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) =>
        current === images.length - 1 ? 0 : current + 1
      );
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Clean up on component unmount
  }, [images]);

  return (
    <div className={`relative w-full h-56 md:h-96 overflow-hidden mb-14 `}>
      {images.map((image, index) => (
        <img
          key={image.attributes.createdAt}
          src={image.attributes.img_url}
          alt={image.attributes.img_url}
          className={`absolute w-full h-full object-cover transition-opacity duration-50 ease-in-out ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
};

export default Slider;
