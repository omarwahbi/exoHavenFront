"use client";
import React, { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import FlightIcon from "@mui/icons-material/Flight";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddToCartButton from "@/app/Components/AddToCartBtn";
import Quantity from "@/app/Components/Quantity";
import Image from "next/image";

export default function Page({ params }) {
  const [item, setItem] = useState(null);
  const [itemImgs, setItemImgs] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchItem(params.id);
  }, [params.id]);

  useEffect(() => {
    if (itemImgs && itemImgs.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex((current) =>
          current === itemImgs.length - 1 ? 0 : current + 1
        );
      }, 10000); // Change slide every 10 seconds

      return () => clearInterval(interval); // Clean up on component unmount
    }
  }, [itemImgs]);

  const fetchItem = async (id) => {
    try {
      const response = await fetch(
        `https://exohavenbackend.onrender.com/api/items/${id}?populate=*`
      );
      const data = await response.json();
      setItem(data.data);
      setItemImgs(data.data.attributes.item_images.data);
    } catch (error) {
      console.error("Error fetching item:", error);
    }
  };

  const nextSlide = () => {
    setActiveIndex((current) =>
      current === itemImgs.length - 1 ? 0 : current + 1
    );
  };

  const prevSlide = () => {
    setActiveIndex((current) =>
      current === 0 ? itemImgs.length - 1 : current - 1
    );
  };

  return (
    item && (
      <div className="w-full md:w-4/5 mx-auto mt-14 mb-14 px-4 md:px-0">
        <div className="flex flex-col md:flex-row md:space-x-12">
          <div className="w-full md:w-3/5 relative">
            <div id="gallery" className="relative w-full" data-carousel="slide">
              <div className="relative h-64 md:h-96 overflow-hidden rounded-lg">
                {itemImgs &&
                  itemImgs.map((img, index) => (
                    <div
                      className={`duration-700 ease-in-out ${
                        index === activeIndex ? "opacity-100" : "opacity-0"
                      }`}
                      data-carousel-item
                      key={img.attributes.id}
                    >
                      <Image
                        src={img.attributes.url}
                        width={500}
                        height={500}
                        className="absolute block max-w-full h-full object-cover rounded-lg object-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                        alt={item.attributes.name}
                      />
                    </div>
                  ))}
              </div>
              {/* Arrows for navigating slides */}
              <div className="absolute top-1/2 left-3 transform -translate-y-1/2">
                <button
                  onClick={prevSlide}
                  className="bg-white bg-opacity-50 hover:bg-opacity-80 p-2 rounded-full"
                >
                  <ArrowBackIosIcon />
                </button>
              </div>
              <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                <button
                  onClick={nextSlide}
                  className="bg-white bg-opacity-50 hover:bg-opacity-80 p-2 rounded-full"
                >
                  <ArrowForwardIosIcon />
                </button>
              </div>
            </div>

            {/* Dots for active slide */}
            <div className="flex justify-center space-x-2 mt-2">
              {itemImgs?.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === activeIndex ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Product Information Section */}
          <div className="w-full md:w-2/5 mt-6 md:mt-0">
            <h2 className="text-2xl md:text-5xl font-bold mb-4 md:mb-8 text-gray-800">
              {item.attributes.name}
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-4">
              {item.attributes.description}
            </p>

            <div className="space-y-4">
              <div className="flex items-center text-lg text-gray-800">
                <CheckCircleIcon className="mr-2 text-green-500" />
                Quality Animals & Supplies
              </div>
              <div className="flex items-center text-lg text-gray-800">
                <FlightIcon className="mr-2 text-blue-500" />
                Safe And Fast Shipping
              </div>
              <div className="flex items-center text-lg text-gray-800">
                <SupportAgentIcon className="mr-2 text-red-500" />
                Fast Respond and Instant Support
              </div>
              <div className="flex items-center text-lg text-gray-800 mt-5">
                <span className="font-bold">
                  Price: {Number(item.attributes.state).toLocaleString()} IQD
                </span>
              </div>
              <div className="flex flex-row justify-between items-center ">
                <div className="mt-10">
                  <AddToCartButton item={item} />
                </div>
                <div className="mt-10">
                  <Quantity item={item} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
