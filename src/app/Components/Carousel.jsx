"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export default function Carousel() {
  const [images, setImages] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);

  // Custom Arrow Components
  const NextArrow = ({ onClick }) => {
    return (
      <div className="arrow next" onClick={onClick}>
        <FaArrowRight />
      </div>
    );
  };

  const PrevArrow = ({ onClick }) => {
    return (
      <div className="arrow prev" onClick={onClick}>
        <FaArrowLeft />
      </div>
    );
  };

  const settings = {
    infinite: true,
    lazyLoad: true,
    speed: 500,
    slidesToShow: 3, // Default for large screens
    slidesToScroll: 1,
    centerMode: true,
    autoplay: true, // Enable auto-rotation
    autoplaySpeed: 3000, // Rotate every 3 seconds
    centerPadding: "0px",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (current, next) => setImageIndex(next),
    responsive: [
      {
        breakpoint: 1024, // For screens below 1024px
        settings: {
          slidesToShow: 2, // Show 2 images on medium-sized screens
        },
      },
      {
        breakpoint: 768, // For screens below 768px (tablets)
        settings: {
          slidesToShow: 1, // Show 1 image on small screens (mobile)
        },
      },
    ],
  };

  // Fetch images from API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          "https://exohavenbackend.onrender.com/api/items?filters[new_arrival][$eq]=true"
        );
        const data = await response.json();
        setImages(data.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="w-full max-w-screen-lg mx-auto my-10 relative">
      <Slider {...settings}>
        {images.map((img, idx) => (
          <Link
            key={img.id}
            className="relative block"
            href={`/item/${img.id}`}
          >
            <div className="relative">
              <Image
                src={img.attributes.image}
                width={300}
                height={300}
                alt={`Carousel item ${img.id}`}
                className={`w-full h-auto object-cover rounded-lg ${
                  idx === imageIndex ? "activeSlide" : "inactiveSlide"
                }`}
              />
              <div className="absolute top-4 left-4 bg-white text-black text-lg font-semibold px-4 py-2 rounded-lg shadow-md">
                New Arrivals
              </div>
            </div>
          </Link>
        ))}
      </Slider>
    </div>
  );
}
